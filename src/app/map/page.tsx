'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface Place {
  id: string
  slug?: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  neighborhood: string | null
  cuisines: string[]
  avg_rating: number | null
  address: string | null
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch places data
  useEffect(() => {
    async function fetchPlaces() {
      try {
        console.log('Fetching places data...')
        const response = await fetch('/api/public/places?limit=100')
        if (!response.ok) throw new Error('Failed to fetch places')
        const data = await response.json()
        console.log('Places data loaded:', data.places?.length || 0, 'places')
        setPlaces(data.places || [])
      } catch (err) {
        console.error('Error fetching places:', err)
        setError('Failed to load restaurant locations')
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [])

  // Initialize Google Maps
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const initializeMap = () => {
      if (!mapRef.current) {
        console.log('Map ref not available yet, retrying...')
        setTimeout(initializeMap, 100)
        return
      }
    
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key not found')
      setError('Google Maps API key not configured')
      setLoading(false)
      return
    }

    console.log('Initializing Google Maps...')
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry']
    })

    loader.load().then(() => {
      console.log('Google Maps API loaded successfully')
      if (!mapRef.current) {
        console.log('Map ref lost during API loading')
        return
      }

      // Nashville coordinates
      const nashvilleCenter = { lat: 36.1627, lng: -86.7816 }
      
      console.log('Creating map instance...')
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: nashvilleCenter,
        zoom: 11,
        restriction: {
          latLngBounds: {
            north: 36.4,
            south: 35.9,
            west: -87.1,
            east: -86.4,
          },
          strictBounds: false,
        },
        styles: [
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.medical',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      })

      console.log('Map instance created, setting state...')
      setMap(mapInstance)
      setLoading(false)
    }).catch((error) => {
      console.error('Error loading Google Maps:', error)
      setError(`Failed to load Google Maps: ${error.message}`)
      setLoading(false)
    })
    }

    // Start initialization with a small delay
    setTimeout(initializeMap, 100)
  }, [places]) // Add places as dependency to ensure it runs after places are loaded

  // Add markers when places data is loaded
  useEffect(() => {
    if (!map || !places.length) return

    const markers: google.maps.Marker[] = []
    const infoWindow = new google.maps.InfoWindow()

    places.forEach((place) => {
      if (!place.coordinates?.lat || !place.coordinates?.lng) {
        console.log('Skipping place without coordinates:', place.name)
        return
      }

      console.log('Adding marker for:', place.name, 'at', place.coordinates)
      const marker = new google.maps.Marker({
        position: { lat: place.coordinates.lat, lng: place.coordinates.lng },
        map: map,
        title: place.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#DC2626" stroke="white" stroke-width="2"/>
              <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
      })

      marker.addListener('click', () => {
        const cuisineText = place.cuisines.length > 0 ? place.cuisines.join(', ') : 'Restaurant'
        const ratingText = place.avg_rating ? `⭐ ${place.avg_rating}` : ''
        const neighborhoodText = place.neighborhood ? ` • ${place.neighborhood}` : ''
        
        infoWindow.setContent(`
          <div style="max-width: 250px; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #1f2937;">
              ${place.name}
            </h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
              ${cuisineText}${neighborhoodText}
            </p>
            ${place.address ? `<p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">${place.address}</p>` : ''}
            ${ratingText ? `<p style="margin: 0 0 12px 0; color: #f59e0b; font-size: 14px; font-weight: 500;">${ratingText}</p>` : ''}
            <a href="/places/${place.slug || place.id}" 
               style="display: inline-block; background: #dc2626; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
              View Details
            </a>
          </div>
        `)
        infoWindow.open(map, marker)
      })

      markers.push(marker)
    })

    // Cleanup function
    return () => {
      markers.forEach(marker => marker.setMap(null))
    }
  }, [map, places])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Nashville Food Map
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Explore Music City's incredible food scene. Click on any marker to learn more about that spot.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-brand-red rounded-full border-2 border-white shadow-sm"></div>
                <span>Restaurant Location</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{places.length} spots mapped</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Nashville food map...</p>
              <p className="text-xs text-gray-400 mt-2">
                Initializing Google Maps API and fetching {places.length} restaurant locations
              </p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <p className="text-gray-600">Please check your Google Maps API configuration.</p>
            </div>
          </div>
        )}

        {/* Map Container - Always rendered */}
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{ 
            minHeight: 'calc(100vh - 200px)',
            height: '600px',
            width: '100%'
          }}
        />
        
        {/* Map Controls Overlay */}
        {!loading && !error && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <h3 className="font-semibold text-gray-900 mb-2">Nashville Food Scene</h3>
            <p className="text-sm text-gray-600 mb-3">
              Discover {places.length} amazing restaurants and eateries across Music City.
            </p>
            <div className="space-y-2 text-xs text-gray-500">
              <p>• Click markers for restaurant details</p>
              <p>• Zoom in to explore neighborhoods</p>
              <p>• Map bounded to Nashville area</p>
            </div>
          </div>
        )}

        {/* Mobile-friendly bottom sheet for place count */}
        {!loading && !error && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 md:hidden">
            <div className="bg-white rounded-full shadow-lg px-4 py-2">
              <span className="text-sm font-medium text-gray-900">
                {places.length} spots mapped
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

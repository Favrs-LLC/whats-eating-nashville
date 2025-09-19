import { DefaultSeoProps } from 'next-seo'

// Default SEO configuration
export const defaultSEO: DefaultSeoProps = {
  title: "What's Eating Nashville",
  titleTemplate: "%s | What's Eating Nashville",
  description: "Discover Nashville's incredible food scene through the eyes of local creators. From hot chicken joints to hidden gems, explore Music City's culinary landscape.",
  canonical: process.env.NEXT_PUBLIC_SITE_URL,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "What's Eating Nashville",
    title: "What's Eating Nashville",
    description: "Discover Nashville's incredible food scene through the eyes of local creators",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "What's Eating Nashville - Discover Music City's Food Scene",
      },
    ],
  },
  twitter: {
    handle: '@whatseatingnash',
    site: '@whatseatingnash',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'application-name',
      content: "What's Eating Nashville",
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: "What's Eating Nashville",
    },
    {
      name: 'format-detection',
      content: 'telephone=no',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'theme-color',
      content: '#E8472B',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
}

// Generate JSON-LD for articles
export function generateArticleJsonLd(article: {
  title: string
  excerpt?: string
  bodyHtml: string
  publishedAt: Date
  slug: string
  creator: {
    displayName: string
    instagramHandle: string
  }
  place: {
    name: string
    address?: string
    neighborhood?: string
  }
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.title,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.publishedAt.toISOString(),
    url: `${baseUrl}/articles/${article.slug}`,
    author: {
      '@type': 'Person',
      name: article.creator.displayName,
      url: `${baseUrl}/creators/${article.creator.instagramHandle}`,
    },
    publisher: {
      '@type': 'Organization',
      name: "What's Eating Nashville",
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    about: {
      '@type': 'Restaurant',
      name: article.place.name,
      address: article.place.address ? {
        '@type': 'PostalAddress',
        streetAddress: article.place.address,
        addressLocality: 'Nashville',
        addressRegion: 'TN',
        addressCountry: 'US',
      } : undefined,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/articles/${article.slug}`,
    },
  }
}

// Generate JSON-LD for places
export function generatePlaceJsonLd(place: {
  name: string
  address?: string | null
  neighborhood?: string | null
  avgRating?: number | null
  reviewCount?: number | null
  cuisines: string[]
  lat?: number | null
  lng?: number | null
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: place.name,
    address: place.address ? {
      '@type': 'PostalAddress',
      streetAddress: place.address,
      addressLocality: place.neighborhood || 'Nashville',
      addressRegion: 'TN',
      addressCountry: 'US',
    } : undefined,
    geo: place.lat && place.lng ? {
      '@type': 'GeoCoordinates',
      latitude: place.lat,
      longitude: place.lng,
    } : undefined,
    aggregateRating: place.avgRating && place.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: place.avgRating,
      reviewCount: place.reviewCount,
    } : undefined,
    servesCuisine: place.cuisines,
    url: `${baseUrl}/places/${place.name.toLowerCase().replace(/\s+/g, '-')}`,
  }
}

// Generate JSON-LD for organization
export function generateOrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "What's Eating Nashville",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: "Discover Nashville's incredible food scene through the eyes of local creators",
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${baseUrl}/contact`,
    },
    sameAs: [
      'https://instagram.com/whatseatingnashville',
      'https://twitter.com/whatseatingnash',
      'https://facebook.com/whatseatingnashville',
    ],
    areaServed: {
      '@type': 'City',
      name: 'Nashville',
      sameAs: 'https://en.wikipedia.org/wiki/Nashville,_Tennessee',
    },
  }
}

// Generate page-specific SEO props
export function generatePageSEO(page: {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    title: page.title,
    description: page.description,
    canonical: `${baseUrl}${page.path}`,
    noindex: page.noIndex || false,
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${baseUrl}${page.path}`,
      images: page.image ? [
        {
          url: page.image,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ] : undefined,
    },
    twitter: {
      cardType: 'summary_large_image',
    },
  }
}

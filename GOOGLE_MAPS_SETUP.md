# Google Maps API Setup Guide

## Overview
The Nashville Food Map requires Google Maps JavaScript API to display restaurant locations with clickable markers.

## Setup Steps

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the **Maps JavaScript API**
4. Enable the **Places API** (optional, for future features)
5. Go to **Credentials** → **Create Credentials** → **API Key**
6. Copy the generated API key

### 2. Configure API Key Restrictions (Recommended)

For security, restrict the API key:

**Application restrictions:**
- Select "HTTP referrers (web sites)"
- Add these referrers:
  - `http://localhost:3010/*` (for local development)
  - `https://whatseatingnashville.vercel.app/*` (for production)
  - `https://*.vercel.app/*` (for preview deployments)

**API restrictions:**
- Select "Restrict key"
- Choose:
  - Maps JavaScript API
  - Places API (if using)

### 3. Set Environment Variables

**Local Development:**
Update your `.env.local` file:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Production:**
```bash
# Set in GitHub secrets
gh secret set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY --body "your_actual_api_key_here"

# Set in Vercel
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY production
```

### 4. Test the Map

1. Start local development: `npm run dev`
2. Visit: `http://localhost:3010/map`
3. You should see:
   - Nashville map bounded to the metro area
   - Red markers for each restaurant location
   - Clickable markers with restaurant details
   - Info windows with links to restaurant pages

## Map Features

- **Nashville Bounds**: Map is restricted to Nashville metro area
- **Restaurant Markers**: Red circular markers for each place
- **Click Interaction**: Click markers to see restaurant details
- **Direct Links**: Info windows link to restaurant detail pages
- **Responsive Design**: Works on desktop and mobile
- **Professional Styling**: Matches site branding

## API Usage

The map uses these Google Maps features:
- **Maps JavaScript API**: Core map functionality
- **Custom Markers**: Branded red markers for restaurants
- **Info Windows**: Popup details for each location
- **Map Restrictions**: Bounded to Nashville area
- **Custom Styling**: Hides competing business POIs

## Cost Considerations

Google Maps pricing (as of 2024):
- **Maps JavaScript API**: $7 per 1,000 map loads
- **Places API**: $17 per 1,000 requests
- **Free Tier**: $200 credit per month

For a food blog, typical usage should stay within free tier limits.

## Troubleshooting

**Map not loading:**
- Check API key is correctly set
- Verify API key restrictions allow your domain
- Check browser console for errors

**Markers not appearing:**
- Verify places have valid lat/lng coordinates
- Check API response in Network tab
- Ensure Supabase data is loading correctly

**Permission errors:**
- Verify Maps JavaScript API is enabled
- Check API key has proper permissions
- Ensure domain is whitelisted in restrictions

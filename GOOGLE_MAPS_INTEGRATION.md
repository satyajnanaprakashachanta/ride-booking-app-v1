# Google Maps Location Autocomplete Feature

## Overview
This feature adds Google Maps Places API integration to the booking form, providing location autocomplete suggestions when users enter addresses like "3293 southern ave". This gives drivers exact location coordinates and detailed address information.

## Features Added

### ✨ Enhanced Location Input
- **Smart Autocomplete**: As users type addresses, Google Maps provides real-time suggestions
- **Exact Coordinates**: Each selected location includes latitude/longitude coordinates
- **Auto-calculation**: Distance and fare are automatically calculated when both locations are selected
- **Driver Visibility**: Drivers can see exact locations with place names and coordinates

### 🎯 Benefits
- **For Riders**: Easy address entry with suggestions
- **For Drivers**: Exact coordinates for precise navigation
- **For System**: More accurate distance/fare calculations

## Setup Instructions

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API** (optional)
4. Create an API key with appropriate restrictions

### 2. Configure API Key
1. Open `/ridebooking-frontend/.env`
2. Replace `YOUR_API_KEY` with your actual Google Maps API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

### 3. API Key Restrictions (Recommended)
For security, restrict your API key:

**Application restrictions:**
- HTTP referrers: `localhost:3000/*`, `localhost:3001/*`, `localhost:3002/*`, `localhost:3003/*`
- For production: Add your domain `yourdomain.com/*`

**API restrictions:**
- Maps JavaScript API
- Places API

### 4. Test the Feature
1. Start the backend: `mvn spring-boot:run`
2. Start the frontend: `npm start`
3. Navigate to booking form
4. Try entering "3293 southern ave" and see autocomplete suggestions
5. Select locations and watch distance/fare auto-calculate

## How It Works

### Frontend (React)
- **LocationAutocomplete Component**: Handles Google Maps Places API integration
- **BookingForm**: Uses enhanced location inputs with autocomplete
- **Auto-calculation**: Calculates distance using Haversine formula and estimates fare

### Backend (Spring Boot)
- **Enhanced Booking Model**: Stores location details as JSON
- **BookingDTO**: Includes pickup/drop location details
- **Database**: New columns for location coordinates and place data

### Data Flow
1. User types address → Google Places API suggests locations
2. User selects location → Coordinates and details stored
3. When both locations selected → Distance/fare auto-calculated
4. Booking created → Enhanced location data sent to backend
5. Driver sees booking → Can access exact coordinates for navigation

## Database Schema Changes

### Booking Table - New Columns
```sql
pickup_location_details TEXT, -- JSON: {name, placeId, coordinates}
drop_location_details TEXT    -- JSON: {name, placeId, coordinates}
```

### Example Location Data
```json
{
  "name": "University of Michigan",
  "placeId": "ChIJ...",
  "coordinates": {
    "lat": 42.2780,
    "lng": -83.7382
  }
}
```

## Usage Examples

### 1. Typical User Flow
1. User enters "3293 southern ave"
2. Google Maps shows suggestions:
   - 3293 Southern Ave, Memphis, TN
   - 3293 Southern Avenue, Louisville, KY
   - etc.
3. User selects specific address
4. System stores exact coordinates and place details
5. Driver can navigate to precise location

### 2. Auto-calculation Example
- **Pickup**: "University of Michigan" (42.2780, -83.7382)
- **Drop**: "Detroit Metro Airport" (42.2162, -83.3554)
- **Distance**: Automatically calculated as ~25.3 miles
- **Fare**: Base $2.50 + (25.3 × $1.75) = $46.78

## Troubleshooting

### Common Issues

**1. "Location suggestions unavailable"**
- Check if Google Maps API key is configured in `.env`
- Verify API key has Places API enabled
- Check browser console for API errors

**2. No autocomplete suggestions**
- Ensure internet connection
- Check API key restrictions (HTTP referrers)
- Verify Places API is enabled in Google Cloud Console

**3. Distance calculation not working**
- Both pickup and drop locations must be selected from autocomplete
- Manual text entry won't trigger auto-calculation
- Check browser console for JavaScript errors

### Debugging Tips
1. Open browser developer tools
2. Check console for Google Maps API messages
3. Network tab shows API requests to Google
4. Look for "Google Maps API loaded successfully" message

## Cost Considerations

### Google Maps API Pricing (as of 2024)
- **Places API**: $32 per 1000 requests
- **Maps JavaScript API**: $7 per 1000 loads
- **Monthly free tier**: $200 credit (covers ~6,000 autocomplete requests)

### Cost Optimization
- Consider implementing request caching
- Add input debouncing (already included)
- Limit suggestions to 5 results (already implemented)
- Use session tokens for Places API optimization

## Future Enhancements

### Possible Improvements
1. **Map Display**: Show pickup/drop locations on an interactive map
2. **Route Visualization**: Display route between locations
3. **Traffic Integration**: Real-time traffic-aware distance/time estimates
4. **Saved Locations**: Allow users to save frequently used addresses
5. **Geolocation**: "Use current location" button for pickup
6. **Address Validation**: Verify addresses before booking creation

### Technical Debt
- Consider moving to @googlemaps/js-api-loader for better React integration
- Implement proper error boundaries for Google Maps failures
- Add loading states and better UX feedback
- Consider using React.memo for performance optimization

## Files Modified

### Frontend
- `src/components/LocationAutocomplete.js` (NEW)
- `src/BookingForm.js` (ENHANCED)
- `public/index.html` (Google Maps API script)
- `.env` (API key configuration)

### Backend
- `models/Booking.java` (new location fields)
- `dto/BookingDTO.java` (new location fields)
- `controllers/BookingController.java` (enhanced mapping)

This feature significantly improves the user experience and provides drivers with exact location information for better service delivery!

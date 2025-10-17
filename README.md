# Ride Booking App - Version 1.0

A comprehensive ride-sharing platform built with Spring Boot backend and React frontend.

## Features

### Core Functionality
- **Dual User Roles**: Riders and Drivers with separate dashboards
- **Real-time Location Services**: Powered by OpenStreetMap (100% free)
- **Smart Booking System**: Automatic distance and fare calculation
- **Live Status Tracking**: Real-time booking status updates
- **Booking History**: Complete ride history with filtering
- **Admin Panel**: Comprehensive admin dashboard for system management

### Technical Highlights
- **Free Location Services**: No API keys required - uses OpenStreetMap Nominatim
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Auto-cleanup System**: Scheduled cleanup of expired bookings
- **Professional UI**: Clean, modern interface without emoji clutter
- **Real-time Updates**: Live status tracking and notifications

## 🛠 Technology Stack

### Backend
- **Spring Boot 3.x** - Java framework
- **Spring Data JPA** - Database ORM
- **H2 Database** - Embedded database
- **Spring Web** - REST API
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **Axios** - HTTP client
- **CSS3** - Styling
- **OpenStreetMap Nominatim API** - Location services

## 📁 Project Structure

```
ridebooking/
├── src/main/java/               # Backend Spring Boot application
│   └── com/rideapp/ridebooking/
│       ├── controllers/         # REST controllers
│       ├── models/             # Entity classes
│       ├── repositories/       # Data repositories
│       ├── services/           # Business logic
│       └── dto/               # Data transfer objects
├── ridebooking-frontend/       # React frontend application
│   ├── public/                # Static assets
│   └── src/                   # React components
│       ├── components/        # Reusable components
│       ├── hooks/            # Custom React hooks
│       ├── services/         # API services
│       └── utils/            # Utility functions
└── target/                    # Build output
```

## Getting Started

### Prerequisites
- **Java 17+**
- **Node.js 16+**
- **npm 8+**
- **Git**

### Backend Setup
1. Navigate to project root:
   ```bash
   cd ridebooking
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd ridebooking-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   
   Frontend will start on `http://localhost:3000`

## 🎯 Usage

### For Riders
1. Select "Book a Ride" from home screen
2. Create account or login
3. Enter pickup and drop-off locations (with autocomplete)
4. View auto-calculated distance and fare
5. Submit booking and track status
6. View booking history

### For Drivers
1. Select "Start Driving" from home screen
2. Create account or login
3. View available ride requests
4. Accept bookings
5. Update ride status
6. View accepted rides history

### For Admins
- Login with mobile: `admin`, password: `9010`
- Manage all bookings and users
- Manual booking cleanup
- System statistics

## 🌟 Key Features Implemented

### Location Services
- **OpenStreetMap Integration**: 100% free, no API keys needed
- **Real-time Autocomplete**: Instant location suggestions
- **Worldwide Coverage**: Works for any location globally
- **Coordinate Storage**: Automatic lat/lng extraction
- **Distance Calculation**: Haversine formula for accurate distances

### Booking Management
- **Smart Fare Calculation**: Base rate + per-mile pricing
- **Status Tracking**: Pending → Accepted → Completed flow
- **Auto-cleanup**: Scheduled removal of expired bookings
- **History Management**: Categorized past and current rides

### User Experience
- **Clean Interface**: Professional design without emoji clutter
- **Responsive Layout**: Side-by-side layouts for better UX
- **Modal Windows**: Smooth overlay interfaces
- **Real-time Updates**: Live status synchronization

## 🔧 Configuration

### Database
- Uses H2 in-memory database (development)
- Data persists during runtime
- Automatic table creation

### Location Services
- OpenStreetMap Nominatim API
- No rate limits for reasonable usage
- No API key required
- 300ms debounce for performance

## 📈 Version 1.0 Accomplishments

- ✅ Complete dual-role user system
- ✅ Real-time location autocomplete
- ✅ Automatic distance/fare calculation  
- ✅ Professional UI without emoji clutter
- ✅ Booking history with modal interface
- ✅ Admin panel with system management
- ✅ Free location services (no API costs)
- ✅ Responsive design for all devices
- ✅ Scheduled booking cleanup system

## Future Enhancements

- Real-time GPS tracking
- Payment integration
- Push notifications
- Driver ratings system
- Advanced analytics
- Mobile app versions

## 🤝 Contributing

This is Version 1.0 of the Ride Booking App. Future contributions and enhancements are welcome!

## 📄 License

This project is developed as a comprehensive ride-sharing solution demonstrating modern web application architecture.

---

**Ride Booking App v1.0** - Complete ride-sharing solution with free location services and professional UI.

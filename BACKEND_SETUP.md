# Backend Setup Guide

## Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## Database Setup
1. Create a MySQL database named `pawfund`
2. Update database credentials in `src/main/resources/application.properties` if needed

## Running the Backend

### Option 1: Using Maven Command
```bash
cd src
mvn spring-boot:run
```

### Option 2: Using the Batch File
```bash
start-backend.bat
```

### Option 3: Using IDE
- Open the project in your IDE (IntelliJ IDEA, Eclipse, etc.)
- Run the main class: `PawfundApplication.java`

## Backend Endpoints

### Admin Endpoints (Require ADMIN role)
- `GET /api/admin/recent-activities` - Get recent activities
- `GET /api/users/stats` - Get user statistics
- `GET /api/pets/stats` - Get pet statistics
- `GET /api/adoptions/stats` - Get adoption statistics
- `GET /api/donations/statistics` - Get donation statistics

### Donation Endpoints
- `GET /api/donations/success` - PayPal success callback
- `GET /api/donations/cancel` - PayPal cancel callback
- `GET /api/donations/statistics` - Get donation statistics (Admin only)

## Default Port
The backend runs on port `8888` by default.

## Access URL
- Backend API: `http://localhost:8888`
- Frontend: `http://localhost:3000`

## Troubleshooting
1. **Port already in use**: Change the port in `application.properties`
2. **Database connection error**: Check MySQL service and credentials
3. **Maven dependencies**: Run `mvn clean install` to download dependencies 
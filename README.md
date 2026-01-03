# 🚗 Vehicle Rental System (VRS) - Backend API

This system provides vehicle inventory management, vehicle booking functionality, user management, etc.

## Links

- **GitHub Repository:** [Repo Link]
- **Live Deployment:** [Deployment Link]

---

## ✨ Features

### Core Functionality

- **User Authentication & Authorization**

  - Secure JWT-based authentication
  - Role-based access control (Admin & Customer)
  - Password hashing
  - Protected API endpoints

- **Vehicle Management**

  - CRUD operations for vehicle inventory
  - Support for multiple vehicle types (Car, Bike, Van, SUV)
  - Vehicle availability tracking
  - Admin-only vehicle management

- **Booking System**

  - Create bookings with automatic price calculation according to daily rent and duration
  - View bookings (role-based: Admin sees all, Customers see own)
  - Cancel bookings (before start date only)
  - Mark bookings as returned (admin)
  - **Automated Return Processing**: System automatically marks overdue bookings as returned after the rent end date

- **User Management**
  - User registration
  - View all users (admin only)
  - Update user profile (Role-based: Admin can update any user profile. Customer can update own profile only)
  - Delete user (admin only)

---

## 🛠️ Technology Stack

### Backend Framework & Technologies

- **Node.js**
- **Express.js**
- **TypeScript**

### Database

- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js

### Authentication & Security

- **jsonwebtoken** - JWT token generation and validation
- **bcryptjs** - Password hashing
- **helmet** - HTTP security headers

---

## Usage Instructions

### Postman Import
- visit this URL in the app: `/docs-v1/swagger.json`
- copy and paste the full link in the Postman and import the collection (this will import all the endpoints and their request/response examples)

---

### API Endpoints

### Authentication
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/v1/auth/signup` | Public |
| POST | `/api/v1/auth/signin` | Public |

---

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/v1/users` | Admin only |
| PUT | `/api/v1/users/:userId` | Admin or Customer |
| DELETE | `/api/v1/users/:userId` | Admin only |

---

### Vehicles
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/v1/vehicles` | Admin only |
| GET | `/api/v1/vehicles` | Public |
| GET | `/api/v1/vehicles/:vehicleId` | Public |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin only |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin only |

---

### Bookings
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/v1/bookings` | Customer or Admin |
| GET | `/api/v1/bookings` | Role-based |
| PUT | `/api/v1/bookings/:bookingId` | Role-based |


### Authentication Flow

1. **Register a User**

   ```bash
   POST /api/v1/auth/signup
   Content-Type: application/json

   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "phone": "1234567890",
     "role": "customer"
   }
   ```

2. **Login**

   ```bash
   POST /api/v1/auth/signin
   Content-Type: application/json

   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

   Response includes a JWT token:

   ```json
   {
     "token": "YUBsjeyJJIULsGnA...",
     "user": { ... }
   }
   ```

3. **Use Token for Protected Endpoints**
   ```bash
   GET /api/v1/bookings
   Authorization: Bearer <jwt_token>
   ```

### Example API Calls

#### Create a Vehicle (Admin Only)

```bash
POST /api/v1/vehicles
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": "50",
  "availability_status": "available"
}
```

#### Create a Booking

```bash
POST /api/v1/bookings
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "customer_id": "1",
  "vehicle_id": "1",
  "rent_start_date": "2025-12-30",
  "rent_end_date": "2026-01-05"
}
```

---


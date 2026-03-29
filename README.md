# Wedding Marketplace & Booking Platform

A complete, production-ready, mobile-first web application designed for discovering, comparing, and booking wedding services and venues. Inspired by modern Indian wedding platforms like Zomato & WeddingBanquets.

## Architecture

* **Frontend**: Next.js 14 (React) with Custom Mobile-First CSS
* **Backend**: Node.js, Express, `jsonwebtoken` (JWT Auth)
* **Database**: MySQL via Prisma ORM

## Included Implementations
1. **Full MySQL Schema**: Included in `/server/prisma/schema.prisma` mapping User roles, Venues, Services, Bookings, Rentals, Wishlists and Lead Inquiries.
2. **Backend**: Express APIs located in `/server`.
3. **Frontend**: Next.js Mobile-first UI located in `/client`.

---

## 🚀 Setup Instructions

### Prerequisites
Make sure you have installed:
- Node.js (v18+)
- MySQL (Running locally or hosted)

### 1. Database & Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/server` directory:
   ```env
   PORT=5000
   DATABASE_URL="mysql://root:password@localhost:3306/wedding_marketplace"
   JWT_SECRET="your_jwt_super_secret"
   ```
4. Push the schema to MySQL and generate Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js frontend:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser. (Switch to Mobile View / Responsive Design Mode in Chrome DevTools using `F12` -> `Ctrl+Shift+M` for the best Zomato-like visual experience).

---

## 📡 API Documentation

### Authentication (`/api/auth`)

#### `POST /api/auth/send-otp`
- **Desc:** Generates a 6 digit mock OTP for a CUSTOMER.
- **Body:** `{ "phone": "9876543210" }`
- **Returns:** `{ "message": "OTP sent successfully" }`

#### `POST /api/auth/verify-otp`
- **Desc:** Logs in or auto-registers a CUSTOMER.
- **Body:** `{ "phone": "9876543210", "otp": "123456" }`
- **Returns:** `{ "message": "...", "token": "JWT_TOKEN", "user": {...} }`

#### `POST /api/auth/login`
- **Desc:** Login for ADMIN and VENDOR using bcrypt passwords.
- **Body:** `{ "email": "admin@test.com", "password": "password123" }`

### Business & Search (`/api/business`)

#### `GET /api/business/categories`
- **Desc:** Returns all 16 listed wedding categories.

#### `GET /api/business/services`
- **Desc:** Supports dynamic query filters.
- **Params:** `?city=Patna&minPrice=10000&maxPrice=50000&categoryId=2`
- **Returns:** Array of service objects with Vendor context.

#### `GET /api/business/venues`
- **Desc:** Query venues based on price per plate and capacity.
- **Params:** `?city=Delhi&minCapacity=500&maxPrice=1500`

### Lead Generation (`/api/business/inquiries`)

#### `POST /api/business/inquiries`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Desc:** Core Lead Generation endpoint. Submits user requirements directly to a Vendor.
- **Body:** 
  ```json
  {
    "vendorId": 1,
    "serviceId": null,
    "venueId": 2,
    "message": "I want to get a quote for a September wedding for 500 guests."
  }
  ```

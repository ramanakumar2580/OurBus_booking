# 🚌 OurBus - Smart Bus Booking System

A Next.js based Bus Ticket Booking System designed for Bus Conductors and Passengers. It features a persistent local database, an interactive seat map, and an optimized boarding algorithm.

## 🚀 Live Demo

Check out the live application here: **[https://our-bus-booking.vercel.app/](https://our-bus-booking.vercel.app/)**

## Features

### 1. Booking System (User View)

- **Interactive Seat Map:** Visual 2x2 layout with 15 rows (60 seats).
- **Validation:** Maximum 6 seats per booking.
- **Smart Search:** Custom dropdowns with city filtering and date navigation.
- **Persistence:** All bookings are saved in LocalStorage (No database required).
- **Ticket Management:** View booking history and cancel tickets.

### 2. Conductor Dashboard (Admin View)

- **Boarding Tracker:** Track who has boarded and who is pending.
- **Click-to-Call:** Direct link to call passengers from the dashboard.
- **Date Filtering:** View bookings for specific dates.

### 3. Optimal Boarding Algorithm

To minimize boarding time, the system implements a **Back-to-Front** sorting algorithm.

- **Logic:** Passengers in the back rows (e.g., Row 15) board first.
- **Reasoning:** This prevents passengers in front rows (e.g., Row 1) from blocking the aisle for those trying to reach the back.
- **Result:** Reduces total settling time significantly.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context + LocalStorage

## Setup & Execution Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ramanakumar2580/OurBus_booking.git
   cd OurBus_booking
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run the Development Server**

   ```bash
   npm run dev
   ```

4. **Access the Application**

   ```bash
   Passenger View: http://localhost:3000

   Conductor View: http://localhost:3000/admin (Or click "Operator Login" in footer)
   ```

## Project Structure

```bash
├── app/
│ ├── booking/ # Booking Page (Seat Selection)
│ ├── admin/ # Conductor Dashboard (Algorithm)
│ ├── page.tsx # Home / Landing Page
│ └── layout.tsx # Global Layout
├── components/
│ ├── SeatMap.tsx # Seat Grid Logic
│ ├── CityInput.tsx # Custom Search Dropdowns
│ └── LoginModal.tsx # User Auth Modal
├── utils/
│ ├── storage.ts # LocalStorage Database Helper
│ └── busConfig.ts # Seat Layout Configuration
└── context/
└── UserContext.tsx # Global User State
```

## Algorithm Implementation

Located in `app/admin/page.tsx`:

```typescript
enhancedBookings.sort((a, b) => b.minRow - a.minRow);
```

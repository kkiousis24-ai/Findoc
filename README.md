# Findoc

Findoc is a full-stack doctor discovery and appointment booking platform designed for the Greek healthcare market.

The application allows users to search for doctors by specialty and location, view doctor profiles, check real-time availability, book appointments, manage their personal bookings, and cancel upcoming appointments.

The project was developed as a modern portfolio application using ASP.NET Core, React, TypeScript, Entity Framework Core, SQLite, and JWT authentication.

---

## Features

### Doctor Discovery

- Search doctors by specialty
- Filter doctors by city
- Browse verified doctor profiles
- View consultation prices
- View ratings and professional information
- Responsive doctor result cards

### Appointment Booking

- Real-time appointment availability
- 30-minute appointment slots
- Weekday scheduling
- Prevention of double booking
- Booking confirmation
- Automatic release of cancelled appointment slots

### Authentication

- User registration
- User login
- JWT-based authentication
- Secure password hashing
- Persistent login session
- Protected API endpoints

### Patient Account

- View personal appointments
- View appointment status
- View doctor and appointment information
- Cancel upcoming appointments
- Cancelled appointments remain visible in appointment history

### User Interface

- Responsive desktop and mobile design
- Dark health-tech visual identity
- Minimal premium interface
- Mobile optimized navigation
- Doctor profile modals
- Appointment booking modal
- Authentication modal
- Responsive appointment management interface

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- Fetch API
- Local Storage

### Backend

- ASP.NET Core
- .NET 10
- Minimal APIs
- Entity Framework Core
- JWT Bearer Authentication
- PasswordHasher
- SQLite

### Database

- SQLite
- Entity Framework Core Migrations

---

## Project Structure

```text
Findoc App
│
├── Findoc.Api
│   ├── Data
│   ├── Migrations
│   ├── Models
│   ├── Properties
│   ├── Program.cs
│   ├── appsettings.json
│   └── Findoc.Api.csproj
│
├── findoc-client
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── README.md
└── Findoc.slnx
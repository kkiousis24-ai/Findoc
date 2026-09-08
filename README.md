# Findoc

Findoc is a full-stack doctor discovery and appointment booking platform designed for the Greek healthcare market.

Users can search for doctors by specialty and location, view doctor profiles, check appointment availability, book appointments, manage their personal bookings, and cancel upcoming appointments through a modern responsive interface.

The project was developed as a portfolio-ready full-stack application using **React, TypeScript, ASP.NET Core, Entity Framework Core, SQLite, and JWT Authentication**.

---

## Screenshots

### Home

![Findoc Home](docs/screenshots/01-home.png)

### Doctor Search

![Findoc Doctor Search](docs/screenshots/02-doctors.png)

### Appointment Booking

![Findoc Booking](docs/screenshots/03-booking.png)

### My Appointments

![Findoc Appointments](docs/screenshots/04-appointments.png)

---

## Features

### Doctor Discovery

- Search doctors by specialty
- Filter doctors by city
- Browse doctor profiles
- View doctor ratings
- View consultation prices
- View professional information and biography
- Responsive doctor result cards
- Dedicated doctor profile modal

### Appointment Booking

- Real-time appointment availability
- 30-minute appointment slots
- Weekday scheduling
- Appointment validation
- Prevention of double booking
- Booking confirmation
- Automatic release of cancelled appointment slots
- Reuse of cancelled appointment slots

### Authentication

- User registration
- User login
- JWT-based authentication
- Secure password hashing
- Persistent login session
- Protected API endpoints
- Authenticated patient account

### Patient Account

- View personal appointments
- View appointment status
- View doctor information
- View appointment date
- View clinic location
- View consultation price
- Cancel upcoming appointments
- Keep cancelled appointments visible in appointment history

### User Interface

- Responsive desktop and mobile design
- Dark health-tech visual identity
- Minimal premium interface
- Mobile-optimized navigation
- Doctor profile modal
- Appointment booking modal
- Authentication modal
- Appointment management interface
- Responsive doctor cards
- Dark green, mint and coral design system

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
- ASP.NET Core PasswordHasher

### Database

- SQLite
- Entity Framework Core Migrations
- Automatic database migration
- Automatic development data seeding

---

## Project Structure

```text
Findoc
│
├── Findoc.Api
│   │
│   ├── Data
│   │   ├── DbSeeder.cs
│   │   └── FindocDbContext.cs
│   │
│   ├── Migrations
│   │
│   ├── Models
│   │   ├── ApplicationUser.cs
│   │   ├── Appointment.cs
│   │   └── Doctor.cs
│   │
│   ├── Properties
│   │
│   ├── Program.cs
│   ├── appsettings.json
│   └── Findoc.Api.csproj
│
├── findoc-client
│   │
│   ├── public
│   │
│   ├── src
│   │   ├── assets
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
│
├── docs
│   └── screenshots
│       ├── 01-home.png
│       ├── 02-doctors.png
│       ├── 03-booking.png
│       └── 04-appointments.png
│
├── .gitignore
├── README.md
└── Findoc.slnx
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Doctors

```http
GET    /api/doctors
GET    /api/doctors/{id}
POST   /api/doctors
DELETE /api/doctors/{id}
```

### Specialties

```http
GET /api/specialties
```

### Availability

```http
GET /api/doctors/{id}/availability?date=YYYY-MM-DD
```

### Appointments

```http
POST  /api/appointments
GET   /api/appointments/my
GET   /api/appointments/{id}
PATCH /api/appointments/{id}/cancel
```

### Health Check

```http
GET /api/health
```

---

## Local Development

### Requirements

Make sure the following are installed:

- .NET 10 SDK
- Node.js
- npm
- Git

---

## Backend Setup

Open a terminal from the project root:

```powershell
cd Findoc.Api
dotnet restore
dotnet run
```

On application startup, Findoc automatically:

- Applies all pending Entity Framework Core migrations
- Creates the local SQLite database when necessary
- Seeds the database with fictional demo doctors when no doctors exist

The API runs by default at:

```text
http://localhost:5087
```

For local development, the SQLite database file is generated locally and excluded from Git through `.gitignore`.

---

## Frontend Setup

Open a second terminal from the project root:

```powershell
cd findoc-client
npm install
npm run dev
```

On Windows PowerShell, if the npm execution policy blocks `npm`, use:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local Vite URL displayed in the terminal.

The frontend communicates with the local API at:

```text
http://localhost:5087
```

---

## JWT Configuration

The JWT signing key is intentionally **not stored in the repository**.

For local development, configure it with .NET User Secrets.

From the backend directory:

```powershell
cd Findoc.Api
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "YOUR-DEVELOPMENT-JWT-KEY"
```

The public JWT configuration stored in `appsettings.json` contains only non-sensitive values such as:

```json
{
  "Jwt": {
    "Issuer": "Findoc.Api",
    "Audience": "Findoc.Client"
  }
}
```

The JWT signing key remains outside source control.

---

## Database

Findoc uses **SQLite** for local development.

The database schema is managed using Entity Framework Core migrations.

When the backend starts, the application executes:

```csharp
await db.Database.MigrateAsync();
```

This automatically applies pending migrations.

The local database file is excluded from Git through `.gitignore`.

---

## Automatic Demo Data Seeding

Findoc includes an automatic database seeder for development and portfolio demonstration.

The seeding logic is located in:

```text
Findoc.Api/Data/DbSeeder.cs
```

When the application starts, it checks whether doctors already exist.

If the doctor table is empty, Findoc automatically creates a set of fictional doctor profiles.

If doctors already exist, the seeder does nothing.

This prevents duplicate demo records while allowing a fresh clone of the project to work immediately.

---

## Demo Doctors

The development database includes fictional doctors across multiple specialties and Greek cities.

### Specialties

- Cardiologist
- Dermatologist
- Neurologist
- Pediatrician
- Orthopedic Doctor

### Cities

- Athens
- Thessaloniki
- Patras
- Ioannina

The demo records include:

- Doctor name
- Specialty
- City
- Clinic address
- Biography
- Consultation price
- Rating

All doctor data used in Findoc is fictional and intended only for development and portfolio demonstration.

---

## Appointment Availability

The current appointment system includes:

- Monday-Friday availability
- 30-minute appointment slots
- Working hours from 09:00 to 17:00
- Past-date validation
- Weekend validation
- Double-booking protection
- Automatic reopening of cancelled appointment slots
- Rebooking of previously cancelled slots

---

## Authentication Flow

Findoc uses JWT Bearer Authentication.

After a successful registration or login:

1. The backend creates a JWT token
2. The frontend stores the token locally
3. Protected API requests include the JWT
4. The backend validates the authenticated user
5. The user can access personal appointment functionality

JWT tokens currently expire after 24 hours.

---

## Security

The application currently implements:

- Password hashing
- JWT authentication
- JWT signature validation
- JWT issuer validation
- JWT audience validation
- Protected patient endpoints
- Appointment ownership validation
- Unique doctor/time appointment constraints
- Local secret management with .NET User Secrets
- Sensitive credential exclusions through `.gitignore`
- SQLite database exclusion from source control
- Authorization checks for appointment cancellation
- Backend validation for appointment scheduling

---

## Current Patient Flow

Findoc currently supports the core patient journey:

1. Create an account
2. Sign in
3. Search for a doctor
4. Filter doctors by specialty and city
5. View a doctor's profile
6. Check appointment availability
7. Select a date
8. Select an available time slot
9. Book an appointment
10. View personal appointments
11. Cancel an upcoming appointment
12. Reuse a cancelled appointment slot

---

## Insurance Filter

The current interface includes an insurance selector for UI demonstration.

Insurance-provider filtering is not yet implemented in the backend.

Real insurance-provider support is planned for a future version.

---

## Current Architecture

The application follows a client-server architecture.

```text
React + TypeScript Frontend
          │
          │ HTTP / JSON
          ▼
ASP.NET Core REST API
          │
          │ Entity Framework Core
          ▼
      SQLite Database
```

Authentication is handled using JWT Bearer tokens between the frontend and backend.

---

## Planned Improvements

Future improvements may include:

- Doctor dashboard
- Doctor registration and onboarding
- Doctor authentication
- Doctor availability management
- Real insurance provider support
- Appointment rescheduling
- Email notifications
- SMS notifications
- Patient reviews
- Patient ratings
- Advanced doctor search
- Map-based doctor discovery
- Admin dashboard
- Role-based authorization
- Cloud deployment
- PostgreSQL production database
- Online payments
- Multi-language support
- Automated testing
- CI/CD pipeline

---

## Project Goals

Findoc was created to demonstrate practical full-stack development skills including:

- REST API design
- Authentication
- Authorization
- Relational database modeling
- Entity Framework Core
- Database migrations
- Database seeding
- React application development
- TypeScript
- Responsive UI/UX
- API integration
- State management
- Healthcare appointment workflows
- Secure secret management
- Git
- GitHub workflow

---

## Portfolio Focus

This project demonstrates experience across both frontend and backend development.

### Frontend Skills

- React component development
- TypeScript
- Responsive design
- State handling
- API integration
- Authentication state
- Dynamic search interfaces
- Modal-based workflows
- Mobile optimization

### Backend Skills

- ASP.NET Core
- Minimal APIs
- REST API design
- Entity Framework Core
- SQLite
- Database relationships
- Database migrations
- Automatic data seeding
- JWT authentication
- Authorization
- Password hashing
- Data validation

---

## Repository

This repository contains both the frontend and backend source code for Findoc.

- Frontend: React + TypeScript
- Backend: ASP.NET Core
- Database: SQLite
- ORM: Entity Framework Core
- Authentication: JWT
- Development data: Automatic seeding

---

## Disclaimer

Findoc is a portfolio and educational project.

The doctors, profiles, appointments, ratings, addresses, and related healthcare information displayed in the application are fictional and are not intended to represent real medical professionals or real healthcare services.

The application should not be used as a production healthcare service in its current form.

---

## License

This project is intended for educational and portfolio purposes.
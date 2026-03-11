# Hospital Appointment & Doctor Scheduling System

A full-stack application for managing hospital resources, doctor schedules, and patient appointments.

## Tech Stack
- **Backend:** Java 21, Spring Boot 3.5, MySQL, Spring Data JPA, Spring Security, JWT, MapStruct
- **Frontend:** React, Vite, Tailwind CSS V4, React Router, Recharts, Axios

## Prerequisites
- Java 21
- Maven
- Node.js & npm
- MySQL Server running locally on port `3306` with database `hospital_db` and credentials (root/root).

## Getting Started

### 1. Backend Setup
1. Create the MySQL database: `CREATE DATABASE hospital_db;`
2. Navigate to the `backend` directory: `cd backend`
3. Check application properties in `src/main/resources/application.properties` to ensure DB credentials match your local setup.
4. Run the Spring Boot application: `mvn spring-boot:run`
5. The backend will start on `http://localhost:8080`.

### 2. Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Note: The frontend uses a custom `@theme` configuration in `index.css` to define the dark mode colors for Tailwind CSS V4.
4. Start the development server: `npm run dev`
5. Access the application at `http://localhost:5173`.

## Roles and Test Flow
There are three user roles in the system: `PATIENT`, `DOCTOR`, and `ADMIN`.

**To test the entire flow:**
1. **Register as PATIENT**: Create an account via `/register`. Check the Patient Dashboard.
2. **Register as DOCTOR**: Create a doctor account (Note: requires assigning a department). You might want to create a department first via an ADMIN account.
3. **Register as ADMIN**: Select 'Admin' on the registration page to create your superuser account.
4. **Admin Flow**: Login as Admin, create a `Department` (e.g., Cardiology, 150 Consultation Fee).
5. **Doctor Flow**: Login as Doctor -> Setup availability slots in "Manage Slots".
6. **Patient Flow**: Login as Patient -> Find Doctors -> Book an Appointment on an available slot.
7. **Doctor Flow**: Login as Doctor -> View Appointments -> Confirm the appointment -> Complete upon resolution.

## Features Implemented
- Completely custom dark-theme UI with Tailwind CSS.
- JWT Role-based protected routes (React Router).
- Advanced overlapping appointment validation on the backend using Spring Data JPA.
- Analytics aggregation algorithms served securely to Admin users visualized with `Recharts`.
- Full separation of concerns for Doctor availability slots arrays in a dedicated relational table.

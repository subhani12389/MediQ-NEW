# MediQ — Smart Hospital Queue & Token Management System 🏥

MediQ is a production-grade full-stack web application designed to eliminate physical hospital waiting rooms. Patients can search for hospitals by city or specialty, generate a digital OPD token from home, track live queue positions, and receive smart "Leave Now" alerts when their turn is ~10–15 minutes away. Hospital receptionists get a dedicated live queue dashboard to call next patients with instant audio chimes, complete consultations, and issue walk-in tokens.

---

## 🌟 Key Features

### 1. Patient App (Public User)
- **Hospital Discovery**: Search and filter hospitals by city (Mumbai, Delhi, Bengaluru, Hyderabad) and medical specialty (Cardiology, Orthopedics, Pediatrics, etc.).
- **Digital Token Generation**: Issue digital OPD tokens instantly from home for a chosen hospital, department, and doctor.
- **Live Token Tracker & Animated Counter**: Real-time display of current serving token, people ahead in line, and calculated estimated wait time.
- **Smart "Leave Now" Alert**: Dynamic notification banner that alerts patients when their position is 1–2 people ahead (~10–15 mins away) so they leave home right on time.
- **QR Code Entry Pass**: Generates a scannable digital QR code modal for fast verification at hospital OPD desks.
- **Visit History**: View past tokens, consultation dates, and re-book tokens with one click.
- **Multi-language Support**: Seamless UI translation between English, Hindi (हिन्दी), and Telugu (తెలుగు).
- **Dark Mode**: Light & Dark mode support.

### 2. Receptionist Portal (Hospital Staff)
- **Role-Based Live Queue Control**: Hospital-specific queue management dashboard.
- **One-Click "Call Next Patient"**: Advances queue and plays a Web Audio API hospital chime alert across all listening client devices.
- **Walk-in Token Desk**: Issue quick OPD tokens for patients arriving in-person without mobile devices.
- **Status Updates**: Mark tokens complete, skip no-shows, or reset daily queues.
- **Live Statistics**: Real-time tracking of total tokens issued today, completed OPDs, waiting patients, and average consultation time.

### 3. System Admin
- **Hospital Management**: Register new partner hospitals, manage departments, and monitor network health.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, TailwindCSS, Lucide Icons, QRCode.react, Canvas Confetti
- **Backend**: Node.js + Express.js (REST API)
- **Database & Realtime**: Supabase (Postgres, Auth, Row Level Security, Realtime WebSockets) with built-in out-of-the-box fallback store
- **Audio Alerts**: Custom Web Audio API chime synthesizer

---

## 📁 Folder Structure

```
MediQ-New/
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, QRCodeModal, NotificationBanner
│   │   ├── context/            # AuthContext, QueueContext, ThemeContext, LanguageContext
│   │   ├── pages/              # LandingPage, HospitalSearch, HospitalDetail, PatientDashboard, PatientHistory, ReceptionistDashboard, AdminDashboard
│   │   ├── utils/              # Audio alert chime synthesizer
│   │   ├── App.jsx             # Routes & Providers
│   │   ├── main.jsx            # React Entrypoint
│   │   └── index.css           # Tailwind & Custom Brand Colors (#C81E3A)
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Express REST API Backend
│   ├── src/
│   │   ├── config/             # Supabase client setup & checks
│   │   ├── controllers/        # Auth, Hospitals, Tokens, Receptionist
│   │   ├── data/               # High-performance pre-seeded fallback data store
│   │   ├── routes/             # Express API routes
│   │   ├── app.js              # Express app setup & CORS
│   │   └── server.js           # Server listener (Port 5000)
│   ├── schema.sql              # Postgres DDL & Supabase RLS Policies
│   ├── seed.js                 # Supabase database seed script
│   └── package.json
│
├── .env.example                # Root environment template
└── README.md
```

---

## 🚀 Quick Setup & Running Locally

### Prerequisites
- Node.js (v18+)

### Step 1: Install Dependencies
Run the following commands using `npm.cmd` (or `npm` on Unix/Mac):

```bash
# Install Server Dependencies
cd server
npm.cmd install

# Install Client Dependencies
cd ../client
npm.cmd install
```

### Step 2: Start the Development Servers

Open two terminal windows:

**Terminal 1 (Backend REST API - Port 5000):**
```bash
cd server
npm.cmd run dev
```

**Terminal 2 (Frontend Client - Port 3000):**
```bash
cd client
npm.cmd run dev
```

Open your browser at `http://localhost:3000`.

---

## 🔒 Supabase Integration & Database Setup (Optional)

MediQ operates out-of-the-box using built-in mock seed data. To connect to a live Supabase project:

1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor in Supabase and run the SQL code from [`server/schema.sql`](file:///c:/Users/DELL-PC/OneDrive/Desktop/MediQ-New/server/schema.sql).
3. Copy your Supabase Project URL and Anon / Service Role Keys.
4. Create a `.env` file in `/server` and `/client` based on `.env.example`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
5. Seed initial data:
   ```bash
   cd server
   npm.cmd run seed
   ```

---

## 💡 Quick Demo Credentials & Role Switcher

Use the **"Demo Role Switcher"** button in the top navigation bar to test all user roles instantly:

- **Patient**: Rahul Sharma (`patient@mediq.com`) — Track Token `#A-103`.
- **Receptionist**: Priya Singh (`receptionist@cityhospital.com`) — Manage City Care Hospital Queue.
- **Admin**: System Administrator (`admin@mediq.com`).

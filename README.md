# HeatGuard MMR 🌡️

> **Real-Time Heatwave Early Warning & Vulnerability Management System for the Mumbai Metropolitan Region (MMR)**

![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

HeatGuard MMR is an end-to-end early warning and public health management platform designed for monitoring Human Thermal Stress and managing municipal heat action plans across all **24 BMC Administrative Wards of Mumbai**.

---

## 🌟 Core Features

### 1. 🗺️ Public Health Dashboard (`/`)
- **Interactive Risk Map**: Built with React-Leaflet and **OpenStreetMap** free tile API.
  - **Layer 1 (Wards)**: 24 GeoJSON ward polygons color-coded by NOAA Heat Index risk score (Low, Moderate, High, Extreme).
  - **Layer 2 (Cooling Shelters)**: Interactive markers showing capacity, current occupancy, operating hours, and drinking water availability.
  - **Layer 3 (Hospitals)**: Interactive markers displaying ICU bed count, dedicated heatstroke beds, and readiness status.
  - **Fly-to & Search**: Real-time filtering by ward name, ID, or geographical zone (South, Central, West, East).
- **Live Weather Integration**: Real-time temperature, relative humidity, wind speed, and solar radiation fetched from the free **Open-Meteo API**.
- **NOAA Heat Index Engine**: Custom calculation using the Rothfusz regression model to derive real-time Human Thermal Stress Index.
- **Headline Risk Card**: Highlights the highest-risk ward with live sensor data and safety warnings.

### 2. 🫀 Interactive Ward Detail Drawer & Gemini AI Advisory
- **Gemini AI Advisory**: Powered by Google Gemini API, generating plain-language public health advisories with actionable Do's and Don'ts tailored to current weather metrics. Includes robust dynamic fallback generation.
- **Human Body Meter**: Medical-style body outline illustration tagged with anatomical stress indicators:
  - 🧠 **Brain & CNS**: Dizziness, confusion, heat syncope risk
  - 🫀 **Heart & Vascular**: Elevated heart rate and circulatory strain
  - 🩺 **Kidneys & Urinary**: Renal dehydration stress & filtration warnings
  - ⚡ **Muscles & Skin**: Heat cramps and perspiration fatigue
- **Demographic Water Intake Guidelines**:
  - 🧑 **Adults**: 3.5 – 4.5 Liters/day (250ml every 20-30 mins outdoors)
  - 👶 **Children**: 2.0 – 2.5 Liters/day (frequent sip reminders)
  - 👴 **Elderly (60+)**: 2.5 – 3.0 Liters/day + ORS electrolytes
- **7-Day Trend Chart**: Historical area chart showing past heat index progression using `recharts`.

### 3. 🏢 Municipal Admin View (`/admin`)
- **Ward Directory**: Live directory covering all 24 BMC wards with search & zone filters.
- **Heat Action Plan Control**: Interactive activation toggles for municipal intervention per ward.
- **Vulnerability Stat Cards**: Live counts of Total Wards, Extreme Risk Wards, and High Risk Wards.
- **Heat Incident Trends Heatmap Card**: Day-of-Week × Hour risk intensity grid visualizing peak vulnerability hours.

### 4. 🏥 Hospital Portal (`/hospital`)
- **Case Logger Form**: Log expected heatstroke/exhaustion patient counts and clinical observation notes.
- **Case Log History**: Structured audit log table of submitted reports.
- **Live Ward Risk Feed**: Real-time read-only feed of all 24 wards sorted by heat index severity for emergency department preparedness.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Design System Tokens (Public Sans, Material Symbols)
- **UI Components**: Custom components built with `class-variance-authority`, `clsx`, `tailwind-merge`
- **Mapping**: [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) + [OpenStreetMap](https://www.openstreetmap.org/)
- **Charts**: [Recharts](https://recharts.org/)
- **APIs**:
  - [Open-Meteo API](https://open-meteo.com/) (Free weather data, no key required)
  - [Google Gemini API](https://ai.google.dev/) (AI Health advisories)
  - OpenStreetMap Tile API (Free map tiles)

---

## 📁 Project Structure

```
heatguard-mmr/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable UI primitives (Button, Card, Badge, HeatMapXL)
│   │   ├── HumanBodyMeter.tsx # Anatomical body stress & demographic hydration component
│   │   ├── Navbar.tsx        # Top navigation header
│   │   ├── RiskMap.tsx       # Interactive Leaflet map with 3 layers
│   │   └── WardDrawer.tsx    # Slide-in ward detail drawer
│   ├── data/
│   │   └── mapData.ts        # GeoJSON boundaries & marker data for 24 Mumbai wards
│   ├── hooks/
│   │   ├── useAdvisory.ts    # Gemini AI advisory hook + dynamic fallback
│   │   ├── useWardHistory.ts # 7-day historical Open-Meteo weather hook
│   │   └── useWeatherData.ts # Parallel Open-Meteo fetch hook for 24 wards
│   ├── lib/
│   │   ├── thermalIndex.ts   # NOAA Heat Index calculation & risk band scoring
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── AdminView.tsx     # Municipal Admin dashboard
│   │   ├── Dashboard.tsx     # Public Dashboard
│   │   └── HospitalView.tsx  # Hospital Portal
│   ├── App.tsx               # Code-split routing
│   ├── index.css             # Tailwind & theme variables
│   └── main.tsx              # Application entry
├── .env                      # Environment configuration (API keys)
├── tailwind.config.ts        # Custom design tokens
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

---

## 📜 Documentation

For full setup instructions, dependencies, environment configuration, and execution commands, see **[SETUP.md](./SETUP.md)**.

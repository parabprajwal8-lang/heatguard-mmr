# HeatGuard MMR — Setup & Execution Guide 🛠️

This document outlines the complete setup requirements, prerequisites, environment configuration, dependency installation, and run/build commands for the **HeatGuard MMR** prototype.

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed on your machine:

- **Node.js**: `v18.0.0` or higher (Recommended: `v20.x`)
- **npm**: `v9.0.0` or higher (Bundled with Node.js)
- **Git**: Installed and configured on your system

To check your versions:
```bash
node --version
npm --version
git --version
```

---

## 🔑 Required API Keys & Services

| Service | Purpose | Key Required? | Notes |
|---|---|---|---|
| **Open-Meteo API** | Live & Historical Weather Data | ❌ **No** | Free public endpoint, no authentication required |
| **OpenStreetMap** | Interactive Map Base Layer | ❌ **No** | Free public tile server (`https://{s}.tile.openstreetmap.org`) |
| **Google Gemini API** | Public Health AI Advisory Generation | ⚠️ **Optional** | Free-tier Gemini API key (`gemini-1.5-flash`). App automatically falls back to an internal dynamic advisory engine if no key is provided. |

---

## ⚙️ Step-by-Step Project Setup

### 1. Navigate to Project Directory
```bash
cd heatguard-mmr
```

### 2. Install Dependencies
Install all required Node modules:
```bash
npm install
```

This installs core dependencies including:
- `react`, `react-dom`, `react-router-dom`
- `leaflet`, `react-leaflet`
- `recharts`
- `tailwindcss`, `autoprefixer`, `postcss`
- `clsx`, `tailwind-merge`, `class-variance-authority`

---

### 3. Environment Configuration

Create a `.env` file in the root of the `heatguard-mmr` folder:

```bash
# In Linux/macOS
touch .env

# In Windows PowerShell
New-Item -ItemType File -Name .env
```

Add your Gemini API Key to `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: If you don't provide a Gemini API key, HeatGuard MMR will automatically use its built-in dynamic health advisory generator, ensuring 100% feature availability without breaking.

---

## 🚀 Running the Application

### Start Development Server
```bash
npm run dev
```

The application will start with hot-module reloading:
- **Local URL**: `http://localhost:5173` (or next available port, e.g. `5174`)

---

### Stop Development Server
- In terminal: Press **`Ctrl + C`** and type `y` when prompted.
- Or via PowerShell:
```powershell
Stop-Process -Name "node" -Force
```

---

## 🏗️ Production Build & Deployment

### 1. Build for Production
Compiles TypeScript, runs Vite bundling, and generates production artifacts in `/dist`:
```bash
npm run build
```

### 2. Preview Production Build Locally
Test the production build locally before deploying:
```bash
npm run preview
```

---

## 🌐 Routes Overview

| Route | Page | Description |
|---|---|---|
| `/` | **Public Dashboard** | Interactive risk map (24 BMC wards), live weather parameters, headline risk index, ward risk bar chart |
| `/admin` | **Municipal Admin View** | Ward status directory, Heat Action Plan deployment toggles, vulnerability stats, Day × Hour heatmap card |
| `/hospital` | **Hospital Portal** | Daily heat-case logger, submission history table, live ward severity feed |

---

## ❓ Troubleshooting

- **Port in use error (`Port 5173 is in use`)**: Vite will automatically switch to `http://localhost:5174`. You can also manually specify a port: `npm run dev -- --port 3000`.
- **Leaflet map tiles missing**: Ensure your device has an active internet connection to stream OpenStreetMap tiles.
- **Node module errors**: Delete `node_modules` and re-install:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

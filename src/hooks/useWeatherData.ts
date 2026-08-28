import { useEffect, useState } from "react";
import { calcHeatIndex, calcUTCI, hiToRiskScore, scoreToBand, type RiskBand } from "@/lib/thermalIndex";

// ── Complete 24 BMC Wards of Mumbai ─────────────────────────────────────────
export const WARDS = [
  // South Zone
  { id: "A",  name: "A Ward (Colaba & Fort)",       lat: 18.9067, lon: 72.8147, zone: "South",   density: "15,400 / sq km" },
  { id: "B",  name: "B Ward (Dongri & Masjid)",      lat: 18.9516, lon: 72.8353, zone: "South",   density: "22,100 / sq km" },
  { id: "C",  name: "C Ward (Marine Lines & Kalbadevi)", lat: 18.9480, lon: 72.8240, zone: "South", density: "95,000 / sq km" },
  { id: "D",  name: "D Ward (Malabar Hill & Grant Rd)", lat: 18.9610, lon: 72.8120, zone: "South", density: "31,000 / sq km" },
  { id: "E",  name: "E Ward (Byculla & Mazgaon)",   lat: 18.9750, lon: 72.8330, zone: "South",   density: "49,500 / sq km" },

  // Central Zone
  { id: "FS", name: "F South (Parel & Sewri)",     lat: 18.9950, lon: 72.8420, zone: "Central", density: "38,000 / sq km" },
  { id: "FN", name: "F North (Sion & Matunga)",    lat: 19.0300, lon: 72.8600, zone: "Central", density: "34,200 / sq km" },
  { id: "GS", name: "G South (Worli & Lower Parel)", lat: 19.0050, lon: 72.8180, zone: "Central", density: "29,800 / sq km" },
  { id: "GN", name: "G North (Dharavi & Dadar W)", lat: 19.0422, lon: 72.8567, zone: "Central", density: "66,000 / sq km" },

  // Western Suburbs
  { id: "HE", name: "H East (Bandra E & Santacruz E)", lat: 19.0650, lon: 72.8450, zone: "West",  density: "27,500 / sq km" },
  { id: "HW", name: "H West (Bandra W & Khar)",       lat: 19.0550, lon: 72.8300, zone: "West",  density: "23,100 / sq km" },
  { id: "KE", name: "K East (Andheri East)",          lat: 19.1150, lon: 72.8650, zone: "West",  density: "35,400 / sq km" },
  { id: "KW", name: "K West (Andheri W & Juhu)",      lat: 19.1136, lon: 72.8305, zone: "West",  density: "31,600 / sq km" },
  { id: "PS", name: "P South (Goregaon)",             lat: 19.1600, lon: 72.8450, zone: "West",  density: "24,800 / sq km" },
  { id: "PN", name: "P North (Malad)",                lat: 19.1850, lon: 72.8480, zone: "West",  density: "28,900 / sq km" },
  { id: "RS", name: "R South (Kandivali)",            lat: 19.2100, lon: 72.8500, zone: "West",  density: "30,100 / sq km" },
  { id: "RC", name: "R Central (Borivali W)",         lat: 19.2288, lon: 72.8564, zone: "West",  density: "18,900 / sq km" },
  { id: "RN", name: "R North (Dahisar)",              lat: 19.2500, lon: 72.8600, zone: "West",  density: "21,500 / sq km" },

  // Eastern Suburbs
  { id: "L",  name: "L Ward (Kurla & Sakinaka)",      lat: 19.0726, lon: 72.8797, zone: "East",    density: "42,500 / sq km" },
  { id: "ME", name: "M East (Govandi & Mankhurd)",    lat: 19.0530, lon: 72.9200, zone: "East",    density: "48,200 / sq km" },
  { id: "MW", name: "M West (Chembur)",               lat: 19.0600, lon: 72.8900, zone: "East",    density: "26,400 / sq km" },
  { id: "N",  name: "N Ward (Ghatkopar)",             lat: 19.0850, lon: 72.9080, zone: "East",    density: "33,000 / sq km" },
  { id: "S",  name: "S Ward (Bhandup & Powai)",       lat: 19.1250, lon: 72.9250, zone: "East",    density: "22,800 / sq km" },
  { id: "T",  name: "T Ward (Mulund)",                lat: 19.1720, lon: 72.9560, zone: "East",    density: "19,200 / sq km" },
];

// ── Types ──────────────────────────────────────────────────────────────────
export interface WardWeather {
  id: string;
  name: string;
  zone: string;
  density: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  solarRad: number;
  heatIndex: number;
  utci: number;
  riskScore: number;
  risk: RiskBand;
}

export interface WeatherState {
  wards: WardWeather[];
  loading: boolean;
  error: string | null;
  updatedAt: Date | null;
}

// ── Open-Meteo fetch (single ward) ────────────────────────────────────────
async function fetchWard(ward: (typeof WARDS)[0]): Promise<WardWeather> {
  const params = new URLSearchParams({
    latitude: String(ward.lat),
    longitude: String(ward.lon),
    current: "temperature_2m,relative_humidity_2m,wind_speed_10m,shortwave_radiation",
    wind_speed_unit: "kmh",
    timezone: "Asia/Kolkata",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo error ${res.status}`);
  const json = await res.json();
  const c = json.current as {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    shortwave_radiation: number;
  };
  const hi = calcHeatIndex(c.temperature_2m, c.relative_humidity_2m);
  const utci = calcUTCI(c.temperature_2m, c.relative_humidity_2m, c.wind_speed_10m, c.shortwave_radiation);
  const score = hiToRiskScore(hi);
  return {
    id: ward.id,
    name: ward.name,
    zone: ward.zone,
    density: ward.density,
    temp: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    windSpeed: c.wind_speed_10m,
    solarRad: c.shortwave_radiation,
    heatIndex: Math.round(hi * 10) / 10,
    utci: Math.round(utci * 10) / 10,
    riskScore: score,
    risk: scoreToBand(score),
  };
}

// ── React hook ────────────────────────────────────────────────────────────
const REFRESH_MS = 5 * 60 * 1000; // refresh every 5 min

export function useWeatherData(): WeatherState {
  const [state, setState] = useState<WeatherState>({
    wards: [],
    loading: true,
    error: null,
    updatedAt: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        // Fetch all 24 wards in parallel
        const results = await Promise.all(WARDS.map(fetchWard));
        if (!cancelled) setState({ wards: results, loading: false, error: null, updatedAt: new Date() });
      } catch (e) {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: String(e) }));
      }
    }

    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return state;
}

import { useState, useEffect } from "react";
import { calcHeatIndex } from "@/lib/thermalIndex";
import { WARDS } from "@/hooks/useWeatherData";

export interface DayPoint {
  date: string; // "Mon", "Tue", etc.
  heatIndex: number;
}

// Fetch past 7 days for a specific ward from Open-Meteo
async function fetchHistory(lat: number, lon: number): Promise<DayPoint[]> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: "temperature_2m_max,relative_humidity_2m_mean",
    past_days: "7",
    forecast_days: "0",
    timezone: "Asia/Kolkata",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const json = await res.json();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const times: string[] = json.daily.time;
  const temps: number[] = json.daily.temperature_2m_max;
  const humids: number[] = json.daily.relative_humidity_2m_mean;

  return times.map((t: string, i: number) => {
    const d = new Date(t);
    const hi = calcHeatIndex(temps[i], humids[i]);
    return { date: days[d.getDay()], heatIndex: Math.round(hi * 10) / 10 };
  });
}

export function useWardHistory(wardId: string | null) {
  const [data, setData] = useState<DayPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wardId) { setData([]); return; }
    const ward = WARDS.find((w) => w.id === wardId);
    if (!ward) return;

    let cancelled = false;
    setLoading(true);
    fetchHistory(ward.lat, ward.lon)
      .then((pts) => { if (!cancelled) { setData(pts); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [wardId]);

  return { data, loading };
}

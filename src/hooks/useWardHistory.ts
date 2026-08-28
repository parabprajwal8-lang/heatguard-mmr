import { useState, useEffect } from "react";
import { calcHeatIndex, calcUTCI } from "@/lib/thermalIndex";
import { WARDS } from "@/hooks/useWeatherData";

export interface DayPoint {
  date: string;
  wbgt: number;
  utci: number;
}

export interface HourPoint {
  hour: string;
  wbgt: number;
  utci: number;
}

interface WardHistoryResult {
  past14Days: DayPoint[];
  next7Days: DayPoint[];
  todayHourly: HourPoint[];
  loading: boolean;
}

async function fetchWardTrends(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: "temperature_2m_max,relative_humidity_2m_mean",
    hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m,shortwave_radiation",
    past_days: "14",
    forecast_days: "7",
    timezone: "Asia/Kolkata",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const json = await res.json();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Process daily (past 14 days + forecast 7 days)
  const times: string[] = json.daily.time;
  const temps: number[] = json.daily.temperature_2m_max;
  const humids: number[] = json.daily.relative_humidity_2m_mean;

  const allDays: DayPoint[] = times.map((t, i) => {
    const d = new Date(t);
    const dateStr = `${d.getDate()}/${d.getMonth() + 1} (${days[d.getDay()]})`;
    const hi = calcHeatIndex(temps[i], humids[i]);
    const utci = calcUTCI(temps[i], humids[i]);
    return { date: dateStr, wbgt: Math.round(hi * 10) / 10, utci: Math.round(utci * 10) / 10 };
  });

  const past14Days = allDays.slice(0, 14);
  const next7Days = allDays.slice(14, 21);

  // Process today's hourly
  const hourlyTimes: string[] = json.hourly.time;
  const hourlyTemps: number[] = json.hourly.temperature_2m;
  const hourlyHumids: number[] = json.hourly.relative_humidity_2m;
  const hourlyWinds: number[] = json.hourly.wind_speed_10m;
  const hourlySolars: number[] = json.hourly.shortwave_radiation;

  // Filter today's 24 hours (index 14*24 to 15*24)
  const todayStartIdx = 14 * 24;
  const todayHourly: HourPoint[] = hourlyTimes.slice(todayStartIdx, todayStartIdx + 24).map((t, idx) => {
    const actualIdx = todayStartIdx + idx;
    const hourLabel = `${new Date(t).getHours()}:00`;
    const hi = calcHeatIndex(hourlyTemps[actualIdx], hourlyHumids[actualIdx]);
    const utci = calcUTCI(hourlyTemps[actualIdx], hourlyHumids[actualIdx], hourlyWinds[actualIdx], hourlySolars[actualIdx]);
    return { hour: hourLabel, wbgt: Math.round(hi * 10) / 10, utci: Math.round(utci * 10) / 10 };
  });

  return { past14Days, next7Days, todayHourly };
}

export function useWardHistory(wardId: string | null): WardHistoryResult {
  const [data, setData] = useState<{ past14Days: DayPoint[]; next7Days: DayPoint[]; todayHourly: HourPoint[] }>({
    past14Days: [],
    next7Days: [],
    todayHourly: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wardId) return;
    const ward = WARDS.find((w) => w.id === wardId);
    if (!ward) return;

    let cancelled = false;
    setLoading(true);
    fetchWardTrends(ward.lat, ward.lon)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [wardId]);

  return { ...data, loading };
}

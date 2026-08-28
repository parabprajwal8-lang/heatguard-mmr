import { useMemo } from "react";
import { useWeatherData } from "@/hooks/useWeatherData";

// ── Types ────────────────────────────────────────────────────────────────────
interface HeatmapCell {
  day: string;
  hour: number;
  value: number; // 0-100 risk score
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = [6, 8, 10, 12, 14, 16, 18, 20];

// Risk color scale matching Phase 3
function cellColor(val: number): string {
  if (val <= 20) return "bg-[#10B981]/30";
  if (val <= 40) return "bg-[#F59E0B]/40";
  if (val <= 60) return "bg-[#F97316]/50";
  if (val <= 80) return "bg-[#EF4444]/50";
  return "bg-[#8B5CF6]/60";
}

function cellTextColor(val: number): string {
  if (val <= 40) return "text-on-surface";
  return "text-white";
}

export default function HeatMapXL() {
  const { wards } = useWeatherData();

  // Generate simulated day × hour grid using real ward avg risk as a baseline
  const avgRisk = useMemo(() => {
    if (wards.length === 0) return 40;
    return wards.reduce((s, w) => s + w.riskScore, 0) / wards.length;
  }, [wards]);

  const cells: HeatmapCell[] = useMemo(() => {
    const result: HeatmapCell[] = [];
    for (const day of DAYS) {
      for (const hour of HOURS) {
        // Simulate: higher risk during midday (12-16), lower at 6,20
        const hourFactor = hour >= 10 && hour <= 16 ? 1.3 : hour >= 8 && hour <= 18 ? 1.0 : 0.6;
        // Slight weekend variation
        const dayFactor = day === "Sat" || day === "Sun" ? 0.85 : 1.0;
        // Add controlled randomness seeded by day+hour
        const seed = (DAYS.indexOf(day) * 13 + hour * 7) % 20 - 10;
        const val = Math.max(0, Math.min(100, Math.round(avgRisk * hourFactor * dayFactor + seed)));
        result.push({ day, hour, value: val });
      }
    }
    return result;
  }, [avgRisk]);

  // Stats
  const peakCell = cells.reduce((max, c) => (c.value > max.value ? c : max), cells[0]);
  const avgVal = Math.round(cells.reduce((s, c) => s + c.value, 0) / cells.length);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-level-1 border border-surface-variant overflow-hidden">
      {/* Header */}
      <div className="px-lg py-md border-b border-surface-variant bg-surface-bright flex justify-between items-center">
        <div>
          <h2 className="text-headline-md font-headline-md text-primary">Heat Incident Trends</h2>
          <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">Weekly risk intensity · Day × Hour breakdown</p>
        </div>
        <div className="flex gap-md">
          <div className="text-center">
            <p className="text-headline-md font-headline-md text-secondary">{peakCell?.value ?? 0}</p>
            <p className="text-label-sm font-label-sm text-on-surface-variant">Peak</p>
          </div>
          <div className="text-center">
            <p className="text-headline-md font-headline-md text-primary">{avgVal}</p>
            <p className="text-label-sm font-label-sm text-on-surface-variant">Avg</p>
          </div>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="p-lg overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Hour labels */}
          <div className="flex ml-12 mb-xs">
            {HOURS.map((h) => (
              <div key={h} className="flex-1 text-center text-label-sm font-label-sm text-on-surface-variant">
                {h}:00
              </div>
            ))}
          </div>

          {/* Rows */}
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-xs mb-xs">
              <div className="w-10 text-label-sm font-label-sm text-on-surface-variant text-right pr-xs shrink-0">{day}</div>
              <div className="flex flex-1 gap-xs">
                {HOURS.map((hour) => {
                  const cell = cells.find((c) => c.day === day && c.hour === hour);
                  const val = cell?.value ?? 0;
                  return (
                    <div
                      key={hour}
                      className={`flex-1 h-10 rounded-DEFAULT flex items-center justify-center text-label-sm font-label-sm font-bold transition-all hover:scale-105 cursor-default ${cellColor(val)} ${cellTextColor(val)}`}
                      title={`${day} ${hour}:00 — Risk score ${val}`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-sm mt-md ml-12">
            <span className="text-label-sm font-label-sm text-on-surface-variant">Low</span>
            {[
              "bg-[#10B981]/30",
              "bg-[#F59E0B]/40",
              "bg-[#F97316]/50",
              "bg-[#EF4444]/50",
              "bg-[#8B5CF6]/60",
            ].map((c, i) => (
              <div key={i} className={`w-6 h-4 rounded-sm ${c}`} />
            ))}
            <span className="text-label-sm font-label-sm text-on-surface-variant">Extreme</span>
          </div>
        </div>
      </div>
    </div>
  );
}

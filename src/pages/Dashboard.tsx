import type { CSSProperties } from "react";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useScenario } from "@/context/ScenarioContext";
import RiskMap from "@/components/RiskMap";
import OrganVisualizer from "@/components/OrganVisualizer";
import { hospitals } from "@/data/mapData";

// ── Trend bar colours (Low→Extreme) ───────────────────────────────────────
function trendBarColor(score: number) {
  if (score <= 20) return "bg-tertiary-fixed";
  if (score <= 40) return "bg-surface-tint";
  if (score <= 60) return "bg-[#f97316]";
  if (score <= 80) return "bg-secondary";
  return "bg-error";
}

const conditionDefs = [
  { icon: "device_thermostat", label: "Temp",     key: "temp"     as const, fmt: (v: number) => `${v.toFixed(1)}°C`, bg: "bg-error-container",        fg: "text-on-error-container" },
  { icon: "water_drop",        label: "Humidity", key: "humidity" as const, fmt: (v: number) => `${v}%`,             bg: "bg-primary-fixed",          fg: "text-on-primary-fixed" },
  { icon: "air",               label: "Wind",     key: "windSpeed"as const, fmt: (v: number) => `${v} km/h`,         bg: "bg-surface-container-high", fg: "text-on-surface-variant" },
  { icon: "light_mode",        label: "Solar",    key: "solarRad" as const, fmt: (v: number) => `${Math.round(v)} W/m²`, bg: "bg-secondary-container", fg: "text-on-secondary-container" },
] as const;

function Skeleton({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return <div className={`animate-pulse bg-surface-container-high rounded ${className}`} style={style} />;
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const { wards, loading } = useWeatherData();
  const { selectedWardId, getEffectiveWardData } = useScenario();

  // Selected ward or fallback to highest risk ward
  const rawWard = wards.find((w) => w.id === selectedWardId) ??
    (wards.length > 0 ? wards.reduce((worst, w) => (w.riskScore > worst.riskScore ? w : worst), wards[0]) : undefined);

  // Apply simulated scenario values if active
  const activeWard = getEffectiveWardData(rawWard);

  // Trend: sort wards by risk score ascending for the bar chart
  const trendWards = [...wards].sort((a, b) => a.riskScore - b.riskScore).slice(0, 7);

  const riskBadgeStyle =
    activeWard?.risk === "Extreme" ? "bg-error-container text-on-error-container border-secondary-fixed"
    : activeWard?.risk === "High" ? "bg-[#feebc8] text-[#dd6b20] border-[#dd6b20]"
    : "bg-surface-container text-on-surface-variant border-outline-variant";

  return (
    <main className="max-w-max-width mx-auto px-margin-desktop py-lg space-y-lg">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg min-h-[calc(100vh-120px)]">

        {/* ── Map section (8 cols) ── */}
        <section className="md:col-span-8 bg-surface-container-lowest rounded-xl shadow-level-1 overflow-hidden relative border border-surface-variant flex flex-col min-h-[500px]">
          <RiskMap wards={wards} loading={loading} />
        </section>

        {/* ── Sidebar (4 cols) ── */}
        <section className="md:col-span-4 flex flex-col gap-lg overflow-y-auto">

          {/* Big number card: Displays BOTH WBGT and UTCI (Phase 2 & Phase 1 fix) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-lg border-t-4 border-error relative overflow-hidden">
            <div className="absolute top-0 right-0 p-md opacity-10">
              <span className="material-symbols-outlined text-[100px]">thermostat</span>
            </div>
            <div className="flex justify-between items-start mb-md relative z-10">
              <div>
                <h3 className="text-body-lg font-body-lg text-on-surface-variant">Thermal Stress Index</h3>
                <span className="text-label-sm font-label-sm text-primary font-bold">
                  {activeWard ? activeWard.name : "Select Ward"}
                </span>
              </div>
              {loading || !activeWard ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <span className={`px-md py-sm rounded-full text-label-md font-label-md border flex items-center gap-xs shadow-sm ${riskBadgeStyle}`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  {activeWard.risk} Risk
                </span>
              )}
            </div>

            {loading || !activeWard ? (
              <Skeleton className="h-20 w-40 mt-sm" />
            ) : (
              <div className="space-y-sm relative z-10">
                <div className="flex items-baseline gap-xs">
                  <span className="text-[64px] leading-none font-bold text-error tracking-tighter">
                    {Math.floor(activeWard.heatIndex)}
                    <span className="text-headline-lg font-headline-lg text-on-surface-variant align-top opacity-50">
                      .{Math.round((activeWard.heatIndex % 1) * 10)}°C
                    </span>
                  </span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant uppercase font-bold">WBGT</span>
                </div>

                {/* UTCI Index alongside WBGT (Phase 2) */}
                <div className="flex items-center gap-sm bg-surface p-xs rounded-lg border border-surface-variant">
                  <span className="material-symbols-outlined text-sm text-secondary">device_thermostat</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">UTCI Index:</span>
                  <span className="text-headline-md font-headline-md text-primary font-bold">{activeWard.utci}°C</span>
                </div>
              </div>
            )}
            <p className="text-body-md font-body-md text-on-surface-variant mt-sm relative z-10">
              {activeWard ? `Live thermal load for ${activeWard.name}.` : "Fetching live data…"}
            </p>
          </div>

          {/* Current Conditions */}
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-md border border-surface-variant">
            <h4 className="text-label-md font-label-md text-primary mb-md uppercase tracking-wider">Current Conditions</h4>
            <div className="grid grid-cols-2 gap-sm">
              {conditionDefs.map(({ icon, label, key, fmt, bg, fg }) => (
                <div key={key} className="bg-surface p-sm rounded-lg border border-surface-variant flex items-center gap-sm">
                  <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center ${fg}`}>
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                  </div>
                  <div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant">{label}</div>
                    {loading || !activeWard ? (
                      <Skeleton className="h-5 w-12 mt-1" />
                    ) : (
                      <div className="text-headline-md font-headline-md text-primary">{fmt(activeWard[key] as number)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Ward Risk Trend */}
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-md border border-surface-variant flex-grow flex flex-col">
            <h4 className="text-label-md font-label-md text-primary mb-md uppercase tracking-wider flex justify-between items-center">
              Ward Risk Comparison
              <span className="material-symbols-outlined text-on-surface-variant text-sm">bar_chart</span>
            </h4>
            <div className="flex-grow relative mt-sm min-h-[100px]">
              {loading ? (
                <div className="absolute inset-0 flex items-end justify-between px-sm pb-lg gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton key={i} className="flex-1 animate-pulse" style={{ height: `${20 + Math.random() * 60}%` }} />
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-end justify-between px-sm pb-6">
                  {trendWards.map((w) => (
                    <div
                      key={w.id}
                      title={`${w.name}: WBGT ${w.heatIndex}°C | UTCI ${w.utci}°C (score ${w.riskScore})`}
                      className={`flex-1 mx-px ${trendBarColor(w.riskScore)} rounded-t-DEFAULT opacity-80 hover:opacity-100 transition-opacity cursor-default`}
                      style={{ height: `${Math.max(8, w.riskScore)}%` }}
                    />
                  ))}
                </div>
              )}
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-label-sm font-label-sm text-on-surface-variant border-t border-surface-variant pt-xs px-sm">
                {trendWards.map((w) => <span key={w.id} className="truncate">{w.id}</span>)}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Phase 8: Age-Based Human Thermal Stress & Organ Response Visualizer */}
      <OrganVisualizer ward={activeWard} />

      {/* Phase 5: Nearby Hospitals & Designated Cooling Centers */}
      <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-lg border border-surface-variant space-y-md">
        <h3 className="text-headline-md font-headline-md text-primary flex items-center gap-xs">
          <span className="material-symbols-outlined text-secondary">medical_services</span>
          Nearby Emergency Hospitals & Medical Care ({activeWard?.name ?? "Mumbai"})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {hospitals.slice(0, 3).map((h) => (
            <div key={h.id} className="bg-surface p-md rounded-xl border border-surface-variant space-y-xs">
              <div className="flex justify-between items-start">
                <span className="text-body-md font-body-md text-primary font-bold">{h.name}</span>
                <span
                  className={`px-sm py-xs rounded text-label-sm font-label-sm font-bold ${
                    h.readiness === "Ready" ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-[#feebc8] text-[#dd6b20]"
                  }`}
                >
                  {h.readiness}
                </span>
              </div>
              <div className="text-label-sm font-label-sm text-on-surface-variant space-y-0.5">
                <p>📞 Emergency: +91 022-24107000</p>
                <p>🛏️ ICU Beds: {h.icuBeds} | Heatstroke Units: {h.heatstrokeBeds}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

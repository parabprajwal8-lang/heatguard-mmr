import { useState } from "react";
import { useWeatherData, type WardWeather } from "@/hooks/useWeatherData";
import type { RiskBand } from "@/lib/thermalIndex";
import HeatMapXL from "@/components/ui/heat-map-xl";

// ── Risk styling ────────────────────────────────────────────────────────────
const RISK_STYLE: Record<RiskBand, { dot: string; pill: string }> = {
  Extreme:  { dot: "bg-secondary",      pill: "bg-secondary-container text-on-secondary-container" },
  High:     { dot: "bg-[#dd6b20]",      pill: "bg-[#feebc8] text-[#dd6b20]" },
  Moderate: { dot: "bg-surface-tint",   pill: "bg-surface-container-high text-on-surface-variant" },
  Low:      { dot: "bg-tertiary-fixed", pill: "bg-tertiary-fixed text-on-tertiary-fixed" },
};

// ── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, id }: { checked: boolean; onChange: () => void; id: string }) {
  return (
    <button id={id} role="switch" aria-checked={checked} onClick={onChange}
      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${checked ? "bg-primary-container" : "bg-surface-variant"}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-surface-container-high rounded ${className}`} />;
}

// ── ActionPlan state per ward (local override, Phase 4+ may persist) ────────
type ActionMap = Record<string, boolean>;

// ── Component ────────────────────────────────────────────────────────────────
export default function AdminView() {
  const { wards, loading, error, updatedAt } = useWeatherData();
  const [actions, setActions] = useState<ActionMap>({
    L: true, ME: false, GN: true, A: false, B: false, KW: false, PN: false,
  });
  const [search, setSearch] = useState("");

  const toggle = (id: string) => setActions((p) => ({ ...p, [id]: !p[id] }));

  const filtered: WardWeather[] = wards.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.zone.toLowerCase().includes(search.toLowerCase())
  );

  const extremeCount = wards.filter((w) => w.risk === "Extreme").length;
  const highCount    = wards.filter((w) => w.risk === "High").length;

  return (
    <>
      {/* ── Side Nav ── */}
      <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex-col p-md bg-surface border-r border-outline-variant z-40">
        <div className="mb-xl flex items-center gap-sm px-2 mt-sm">
          <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">monitoring</span>
          </div>
          <div>
            <h2 className="text-headline-md font-headline-md text-primary leading-tight">Health Monitoring</h2>
            <p className="text-label-sm font-label-sm text-on-surface-variant">MMR Operations</p>
          </div>
        </div>
        <nav className="flex flex-col gap-sm flex-1">
          {[
            { icon: "dashboard",         label: "Overview",         active: false },
            { icon: "map",               label: "Regional Data",    active: true  },
            { icon: "shield_with_heart", label: "Heat Action Plan", active: false },
            { icon: "medical_services",  label: "Emergency Logs",   active: false },
          ].map(({ icon, label, active }) => (
            <a key={label} href="#"
              className={`flex items-center gap-md px-md py-3 rounded-lg text-label-md font-label-md transition-all ${active ? "bg-secondary-container text-on-secondary-container font-bold scale-[0.98]" : "text-on-surface-variant hover:bg-surface-container-high"}`}
            >
              <span className="material-symbols-outlined" style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>{icon}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-sm">
          <button className="w-full py-3 px-md bg-primary text-on-primary rounded-lg text-label-md font-label-md font-bold shadow-sm hover:opacity-90 transition-opacity mb-md">
            Activate Heat Action Plan
          </button>
          <div className="border-t border-outline-variant pt-sm">
            {[{ icon: "help", label: "Help" }, { icon: "logout", label: "Logout" }].map(({ icon, label }) => (
              <a key={label} href="#" className="flex items-center gap-md px-md py-2 text-on-surface-variant hover:bg-surface-container-high text-label-md font-label-md rounded-lg transition-all">
                <span className="material-symbols-outlined">{icon}</span>{label}
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="pt-0 md:pl-64 min-h-screen">
        <div className="p-margin-mobile md:p-lg max-w-7xl mx-auto space-y-lg">

          {/* Page header */}
          <div className="flex justify-between items-end pb-sm border-b border-surface-variant">
            <div>
              <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary">Municipal Admin View</h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant mt-xs">
                {updatedAt ? `Live data · ${updatedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Loading live data…"}
              </p>
            </div>
            <button className="hidden md:flex items-center gap-xs px-md py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-label-md font-label-md text-primary hover:bg-surface-bright shadow-level-1 transition-all">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Export Report
            </button>
          </div>

          {/* Stat bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {[
              { label: "Total Wards",  value: loading ? "--" : wards.length, color: "border-primary",      textColor: "text-primary",      icon: "location_city", iconBg: "bg-surface-container-low",    iconFg: "text-primary"    },
              { label: "Extreme Risk", value: loading ? "--" : extremeCount, color: "border-secondary",    textColor: "text-secondary",    icon: "warning",       iconBg: "bg-secondary-container",      iconFg: "text-secondary"  },
              { label: "High Risk",    value: loading ? "--" : highCount,    color: "border-[#dd6b20]",    textColor: "text-[#dd6b20]",    icon: "thermostat",    iconBg: "bg-[#feebc8]",                iconFg: "text-[#dd6b20]"  },
            ].map(({ label, value, color, textColor, icon, iconBg, iconFg }) => (
              <div key={label} className={`bg-surface-container-lowest rounded-xl p-lg shadow-level-1 border-l-4 ${color}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">{label}</p>
                    <h3 className={`text-display-lg-mobile font-display-lg-mobile mt-xs ${textColor}`}>{value}</h3>
                  </div>
                  <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${iconFg}`}>{icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-error-container text-on-error-container rounded-xl p-md flex items-center gap-sm text-body-md font-body-md">
              <span className="material-symbols-outlined">wifi_off</span>
              Could not fetch live weather. Showing last known data. ({error})
            </div>
          )}

          {/* Ward table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 overflow-hidden">
            <div className="px-lg py-md border-b border-surface-variant bg-surface-bright flex justify-between items-center">
              <h2 className="text-headline-md font-headline-md text-primary">Ward Status Directory</h2>
              <div className="relative w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                <input className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Search ward or zone…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-variant">
                    {["Ward Name", "Heat Index", "Current Risk", "Population Density", "Heat Action Plan"].map((h, i) => (
                      <th key={h} className={`px-lg py-sm text-label-md font-label-md text-primary font-bold${i === 4 ? " text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((__, j) => (
                          <td key={j} className="px-lg py-md"><Skeleton className="h-5 w-full" /></td>
                        ))}
                      </tr>
                    ))
                  ) : filtered.map((w) => {
                    const rs = RISK_STYLE[w.risk];
                    return (
                      <tr key={w.id} className="hover:bg-surface-bright transition-colors">
                        <td className="px-lg py-md text-body-md font-body-md text-on-background font-medium">{w.name}</td>
                        <td className="px-lg py-md text-headline-md font-headline-md text-primary">{w.heatIndex.toFixed(1)}°C</td>
                        <td className="px-lg py-md">
                          <span className={`inline-flex items-center gap-xs px-3 py-1 rounded-full ${rs.pill} text-label-sm font-label-sm font-bold`}>
                            <span className={`w-2 h-2 rounded-full ${rs.dot}`} />{w.risk}
                          </span>
                        </td>
                        <td className="px-lg py-md text-body-md font-body-md text-on-surface-variant">{w.density}</td>
                        <td className="px-lg py-md text-right">
                          <div className="inline-flex items-center gap-sm">
                            <Toggle id={`toggle-${w.id}`} checked={!!actions[w.id]} onChange={() => toggle(w.id)} />
                            <span className={`text-label-sm font-label-sm w-12 text-left ${actions[w.id] ? "text-primary" : "text-outline"}`}>
                              {actions[w.id] ? "Active" : "Standby"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-lg py-md border-t border-surface-variant flex justify-between items-center bg-surface-container-lowest">
              <span className="text-label-sm font-label-sm text-on-surface-variant">
                {loading ? "Loading…" : `Showing ${filtered.length} of ${wards.length} wards`}
              </span>
              <div className="flex gap-xs">
                <button disabled className="p-1 rounded bg-surface-container text-on-surface-variant disabled:opacity-50">
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded bg-primary-container text-on-primary-container text-label-sm font-label-sm font-bold flex items-center justify-center">1</button>
                <button className="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Heatmap — Phase 7 */}
          <HeatMapXL />
        </div>
      </main>
    </>
  );
}

import type { WardWeather } from "@/hooks/useWeatherData";
import { useAdvisory } from "@/hooks/useAdvisory";
import { useWardHistory } from "@/hooks/useWardHistory";
import HumanBodyMeter from "@/components/HumanBodyMeter";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useScenario } from "@/context/ScenarioContext";

interface WardDrawerProps {
  ward: WardWeather | null;
  onClose: () => void;
}

function riskColor(risk: string) {
  switch (risk) {
    case "Extreme": return { bg: "bg-secondary-container", text: "text-on-secondary-container", border: "border-secondary" };
    case "High":    return { bg: "bg-[#feebc8]", text: "text-[#dd6b20]", border: "border-[#dd6b20]" };
    case "Moderate":return { bg: "bg-surface-container-high", text: "text-on-surface-variant", border: "border-surface-tint" };
    default:        return { bg: "bg-tertiary-fixed", text: "text-on-tertiary-fixed", border: "border-tertiary-fixed-dim" };
  }
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-surface-container-high rounded ${className}`} />;
}

export default function WardDrawer({ ward, onClose }: WardDrawerProps) {
  const { getEffectiveWardData } = useScenario();
  const activeWard = getEffectiveWardData(ward ?? undefined);

  const { advisory, loading: advLoading } = useAdvisory(
    activeWard?.name ?? null,
    activeWard?.risk ?? null,
    activeWard?.riskScore ?? null,
    activeWard?.temp ?? null,
    activeWard?.heatIndex ?? null
  );

  const { past14Days, next7Days, todayHourly, loading: histLoading } = useWardHistory(activeWard?.id ?? null);

  if (!activeWard) return null;
  const rc = riskColor(activeWard.risk);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-[1100]" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-full sm:w-[480px] bg-surface-container-lowest z-[1200] shadow-level-2 border-l border-surface-variant flex flex-col animate-slide-in overflow-y-auto">

        {/* Header */}
        <div className={`p-lg border-b-4 ${rc.border}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-headline-md font-headline-md text-primary">{activeWard.name}</h2>
              <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">{activeWard.zone} Zone · Ward {activeWard.id}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="mt-md flex items-end justify-between gap-md">
            <div>
              <span className="text-label-sm font-label-sm text-on-surface-variant block uppercase font-bold">WBGT (Heat Index)</span>
              <span className="text-[48px] leading-none font-bold text-primary tracking-tighter">
                {Math.floor(activeWard.heatIndex)}
                <span className="text-headline-lg text-on-surface-variant opacity-50">.{Math.round((activeWard.heatIndex % 1) * 10)}°C</span>
              </span>
            </div>

            {/* UTCI Display (Phase 2) */}
            <div className="text-right">
              <span className="text-label-sm font-label-sm text-on-surface-variant block uppercase font-bold">UTCI Index</span>
              <span className="text-headline-md font-headline-md text-secondary font-bold">
                {activeWard.utci}°C
              </span>
            </div>

            <span className={`mb-2 px-md py-xs rounded-full text-label-md font-label-md font-bold ${rc.bg} ${rc.text}`}>
              {activeWard.risk}
            </span>
          </div>
          <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">Risk score {activeWard.riskScore}/100</p>
        </div>

        {/* Conditions Grid */}
        <div className="p-lg space-y-md">
          <h3 className="text-label-md font-label-md text-primary uppercase tracking-wider">Live Conditions</h3>
          <div className="grid grid-cols-2 gap-sm">
            {[
              { icon: "device_thermostat", label: "Temp",     value: `${activeWard.temp.toFixed(1)}°C` },
              { icon: "water_drop",        label: "Humidity", value: `${activeWard.humidity}%` },
              { icon: "air",               label: "Wind",     value: `${activeWard.windSpeed} km/h` },
              { icon: "light_mode",        label: "Solar",    value: `${Math.round(activeWard.solarRad)} W/m²` },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-surface p-sm rounded-lg border border-surface-variant">
                <div className="flex items-center gap-xs mb-xs">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">{icon}</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant">{label}</span>
                </div>
                <span className="text-headline-md font-headline-md text-primary">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Public Health Advisory */}
        <div className="p-lg border-t border-surface-variant space-y-md">
          <h3 className="text-label-md font-label-md text-primary uppercase tracking-wider flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm text-secondary">health_and_safety</span>
            Public Health Advisory
            {advLoading && (
              <span className="ml-auto flex items-center gap-xs text-on-surface-variant text-label-sm font-label-sm font-normal normal-case tracking-normal">
                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Updating…
              </span>
            )}
          </h3>

          {advLoading ? (
            <div className="space-y-sm">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : advisory ? (
            <div className="space-y-md">
              <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed bg-surface-bright p-sm rounded-lg border border-surface-variant">
                {advisory.summary}
              </p>
              <div className="space-y-xs">
                {advisory.dos.map((tip, i) => (
                  <p key={`do-${i}`} className="text-body-md font-body-md text-on-surface flex items-start gap-xs">
                    <span className="text-tertiary-fixed-dim shrink-0">✅</span> {tip}
                  </p>
                ))}
                {advisory.donts.map((tip, i) => (
                  <p key={`dont-${i}`} className="text-body-md font-body-md text-on-surface flex items-start gap-xs">
                    <span className="text-error shrink-0">❌</span> {tip}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {/* Human Body Meter */}
          <HumanBodyMeter riskLevel={activeWard.risk} riskScore={activeWard.riskScore} advisory={advisory} />
        </div>

        {/* Phase 4: Today's Real-Time Hourly Graph */}
        <div className="p-lg border-t border-surface-variant">
          <h3 className="text-label-md font-label-md text-primary uppercase tracking-wider mb-md flex justify-between items-center">
            Today's Real-Time Hourly Thermal Graph
            <span className="material-symbols-outlined text-sm text-secondary">schedule</span>
          </h3>
          {histLoading ? (
            <div className="h-28 bg-surface-container rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={todayHourly}>
                <defs>
                  <linearGradient id="todayGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#43474e' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#43474e' }} axisLine={false} tickLine={false} width={25} />
                <Tooltip
                  contentStyle={{ borderRadius: '0.5rem', border: '1px solid #c4c6cf', fontFamily: 'Public Sans', fontSize: 11 }}
                  formatter={(val: unknown) => [`${val}°C`, 'WBGT']}
                />
                <Area type="monotone" dataKey="wbgt" stroke="#ba1a1a" fill="url(#todayGrad)" strokeWidth={2} dot={{ r: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Phase 3: Past 14-Day Trend Chart Card */}
        <div className="p-lg border-t border-surface-variant">
          <h3 className="text-label-md font-label-md text-primary uppercase tracking-wider mb-md flex justify-between items-center">
            Past 14 Days Historical Thermal Load
            <span className="material-symbols-outlined text-sm text-primary">history</span>
          </h3>
          {histLoading ? (
            <div className="h-32 bg-surface-container rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={past14Days}>
                <defs>
                  <linearGradient id="pastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a365d" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1a365d" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#43474e' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#43474e' }} axisLine={false} tickLine={false} width={25} />
                <Tooltip
                  contentStyle={{ borderRadius: '0.5rem', border: '1px solid #c4c6cf', fontFamily: 'Public Sans', fontSize: 11 }}
                  formatter={(val: unknown) => [`${val}°C`, 'WBGT']}
                />
                <Area type="monotone" dataKey="wbgt" stroke="#1a365d" fill="url(#pastGrad)" strokeWidth={2} dot={{ r: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Phase 3: Next 7 Days Forecast Chart Card */}
        <div className="p-lg border-t border-surface-variant">
          <h3 className="text-label-md font-label-md text-primary uppercase tracking-wider mb-md flex justify-between items-center">
            Next 7 Days Forecast Projection
            <span className="material-symbols-outlined text-sm text-secondary">online_prediction</span>
          </h3>
          {histLoading ? (
            <div className="h-32 bg-surface-container rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={next7Days}>
                <defs>
                  <linearGradient id="nextGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ad3035" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ad3035" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#43474e' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#43474e' }} axisLine={false} tickLine={false} width={25} />
                <Tooltip
                  contentStyle={{ borderRadius: '0.5rem', border: '1px solid #c4c6cf', fontFamily: 'Public Sans', fontSize: 11 }}
                  formatter={(val: unknown) => [`${val}°C`, 'Forecast WBGT']}
                />
                <Area type="monotone" dataKey="wbgt" stroke="#ad3035" fill="url(#nextGrad)" strokeWidth={2} dot={{ r: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
}

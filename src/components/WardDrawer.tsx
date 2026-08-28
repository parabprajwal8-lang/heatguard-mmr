import type { WardWeather } from "@/hooks/useWeatherData";
import { useAdvisory } from "@/hooks/useAdvisory";
import { useWardHistory } from "@/hooks/useWardHistory";
import HumanBodyMeter from "@/components/HumanBodyMeter";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
  const { advisory, loading: advLoading } = useAdvisory(
    ward?.name ?? null,
    ward?.risk ?? null,
    ward?.riskScore ?? null,
    ward?.temp ?? null,
    ward?.heatIndex ?? null
  );
  const { data: historyData, loading: histLoading } = useWardHistory(ward?.id ?? null);

  if (!ward) return null;
  const rc = riskColor(ward.risk);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-[1100]" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-16 h-[calc(100vh-64px)] w-full sm:w-[440px] bg-surface-container-lowest z-[1200] shadow-level-2 border-l border-surface-variant flex flex-col animate-slide-in overflow-y-auto">

        {/* Header */}
        <div className={`p-lg border-b-4 ${rc.border}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-headline-md font-headline-md text-primary">{ward.name}</h2>
              <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">{ward.zone} Zone · Ward {ward.id}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="mt-md flex items-end gap-md">
            <span className="text-[56px] leading-none font-bold text-primary tracking-tighter">
              {Math.floor(ward.heatIndex)}
              <span className="text-headline-lg text-on-surface-variant opacity-50">.{Math.round((ward.heatIndex % 1) * 10)}</span>
            </span>
            <span className={`mb-2 px-md py-xs rounded-full text-label-md font-label-md font-bold ${rc.bg} ${rc.text}`}>
              {ward.risk}
            </span>
          </div>
          <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">Heat Index · Risk score {ward.riskScore}/100</p>
        </div>

        {/* Conditions */}
        <div className="p-lg space-y-md">
          <h3 className="text-label-md font-label-md text-primary uppercase tracking-wider">Live Conditions</h3>
          <div className="grid grid-cols-2 gap-sm">
            {[
              { icon: "device_thermostat", label: "Temp",     value: `${ward.temp.toFixed(1)}°C` },
              { icon: "water_drop",        label: "Humidity", value: `${ward.humidity}%` },
              { icon: "air",               label: "Wind",     value: `${ward.windSpeed} km/h` },
              { icon: "light_mode",        label: "Solar",    value: `${Math.round(ward.solarRad)} W/m²` },
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
              <Skeleton className="h-4 w-4/6" />
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

          {/* Human Body Meter & Hydration Guide */}
          <HumanBodyMeter riskLevel={ward.risk} riskScore={ward.riskScore} advisory={advisory} />
        </div>

        {/* 7-Day Trend chart */}
        <div className="p-lg border-t border-surface-variant flex-grow">
          <h3 className="text-label-md font-label-md text-primary uppercase tracking-wider mb-md">7-Day Heat Index Trend</h3>
          {histLoading ? (
            <div className="h-32 bg-surface-container rounded-lg animate-pulse" />
          ) : historyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="hiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a365d" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1a365d" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#43474e' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#43474e' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{ borderRadius: '0.5rem', border: '1px solid #c4c6cf', fontFamily: 'Public Sans', fontSize: 12 }}
                  formatter={(val: unknown) => [`${val}°C`, 'Heat Index']}
                />
                <Area type="monotone" dataKey="heatIndex" stroke="#1a365d" fill="url(#hiGrad)" strokeWidth={2} dot={{ r: 3, fill: '#1a365d' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 bg-surface-container rounded-lg flex items-center justify-center text-on-surface-variant text-label-sm font-label-sm opacity-50">
              No historical data
            </div>
          )}
        </div>
      </div>
    </>
  );
}

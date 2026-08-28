import { useState } from "react";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useScenario } from "@/context/ScenarioContext";
import type { RiskBand } from "@/lib/thermalIndex";

// ── Risk badge styles ───────────────────────────────────────────────────────
const RISK_STYLE: Record<RiskBand, string> = {
  Extreme:  "bg-secondary-container text-on-secondary-container",
  High:     "bg-[#feebc8] text-[#dd6b20]",
  Moderate: "bg-surface-container-high text-on-surface-variant",
  Low:      "bg-tertiary-fixed text-on-tertiary-fixed",
};

// ── Case log entry ──────────────────────────────────────────────────────────
interface CaseEntry {
  id: number;
  date: string;
  expected: number;
  actual: number;
  notes: string;
}

export default function HospitalView() {
  const { wards, loading } = useWeatherData();
  const { scenarioActive, simulatedIndex, getEffectiveWardData } = useScenario();

  const [cases, setCases] = useState<CaseEntry[]>([
    { id: 1, date: "2026-08-27", expected: 12, actual: 9, notes: "Mostly elderly patients from L Ward" },
    { id: 2, date: "2026-08-26", expected: 8, actual: 11, notes: "Spike from outdoor workers in Dharavi" },
  ]);
  const [expected, setExpected] = useState("");
  const [notes, setNotes] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expected) return;
    setCases((prev) => [
      { id: Date.now(), date: new Date().toISOString().slice(0, 10), expected: Number(expected), actual: 0, notes },
      ...prev,
    ]);
    setExpected("");
    setNotes("");
  };

  const sortedWards = [...wards].sort((a, b) => b.riskScore - a.riskScore);

  // Highest risk ward effective index
  const topWard = getEffectiveWardData(sortedWards[0]);
  const effectiveScore = topWard?.riskScore ?? 50;

  // Phase 7 Formula: Expected Bed & Infrastructure Requirement Predictions
  // Formula: multiplier based on effective risk score (0-100)
  const riskMultiplier = Math.max(1.0, 1.0 + (effectiveScore - 20) * 0.04);
  const estimatedSurgeBeds = Math.round(45 * riskMultiplier);
  const estimatedICUNeeded = Math.round(12 * riskMultiplier);
  const estimatedMistingResus = Math.round(8 * riskMultiplier);
  const estimatedORSPackets = Math.round(1500 * riskMultiplier);

  return (
    <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">

      {/* Header */}
      <div className="pb-sm border-b border-surface-variant flex flex-col sm:flex-row sm:items-end justify-between gap-md">
        <div>
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary">
            Hospital Operations Portal
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant mt-xs">
            Heat-case tracking, live risk feeds, and clinical surge capacity forecasting.
          </p>
        </div>
        {scenarioActive && (
          <div className="bg-secondary-container text-on-secondary-container px-md py-xs rounded-full text-label-sm font-label-sm font-bold flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">tune</span>
            SIMULATED OVERRIDE: {simulatedIndex}°C UTCI
          </div>
        )}
      </div>

      {/* Phase 7 Prediction Panel */}
      <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-lg border border-surface-variant space-y-md">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-md font-headline-md text-primary flex items-center gap-xs">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
            Expected Bed & Infrastructure Requirement Prediction
          </h2>
          <span className="text-label-sm font-label-sm px-sm py-xs bg-surface-container-high rounded text-on-surface-variant">
            Formula Estimate (Live Score: {effectiveScore}/100)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
          <div className="bg-surface p-md rounded-xl border border-surface-variant text-center">
            <span className="material-symbols-outlined text-primary text-md">bed</span>
            <span className="text-label-sm font-label-sm text-on-surface-variant block mt-xs">Surge General Beds</span>
            <span className="text-headline-lg font-headline-lg text-primary font-bold">{estimatedSurgeBeds}</span>
            <span className="text-[10px] text-on-surface-variant block mt-0.5">Est. {riskMultiplier.toFixed(1)}x baseline</span>
          </div>

          <div className="bg-surface p-md rounded-xl border border-surface-variant text-center">
            <span className="material-symbols-outlined text-secondary text-md">medical_services</span>
            <span className="text-label-sm font-label-sm text-on-surface-variant block mt-xs">ICU Resuscitation Beds</span>
            <span className="text-headline-lg font-headline-lg text-secondary font-bold">{estimatedICUNeeded}</span>
            <span className="text-[10px] text-on-surface-variant block mt-0.5">High thermal monitoring</span>
          </div>

          <div className="bg-surface p-md rounded-xl border border-surface-variant text-center">
            <span className="material-symbols-outlined text-error text-md">ac_unit</span>
            <span className="text-label-sm font-label-sm text-on-surface-variant block mt-xs">Cooling Immersion Tubs</span>
            <span className="text-headline-lg font-headline-lg text-error font-bold">{estimatedMistingResus}</span>
            <span className="text-[10px] text-on-surface-variant block mt-0.5">Rapid ice water immersion</span>
          </div>

          <div className="bg-surface p-md rounded-xl border border-surface-variant text-center">
            <span className="material-symbols-outlined text-tertiary-fixed-dim text-md">water_drop</span>
            <span className="text-label-sm font-label-sm text-on-surface-variant block mt-xs">ORS Electrolyte Reserves</span>
            <span className="text-headline-lg font-headline-lg text-primary font-bold">{estimatedORSPackets}</span>
            <span className="text-[10px] text-on-surface-variant block mt-0.5">Packets required / 24h</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-lg">

        {/* ── Left: Case Logger (3 cols) ── */}
        <div className="lg:col-span-3 space-y-lg">

          {/* Log Form */}
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-lg border border-surface-variant">
            <h2 className="text-headline-md font-headline-md text-primary flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
              Log Today's Expected Heat Cases
            </h2>
            <form onSubmit={submit} className="space-y-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div>
                  <label htmlFor="expected" className="block text-label-md font-label-md text-primary mb-xs">
                    Expected Cases
                  </label>
                  <input
                    id="expected"
                    type="number"
                    min={0}
                    value={expected}
                    onChange={(e) => setExpected(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-label-md font-label-md text-primary mb-xs">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    disabled
                  />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block text-label-md font-label-md text-primary mb-xs">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any relevant observations…"
                  className="w-full px-md py-sm bg-surface border border-outline-variant rounded-lg text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-xl py-sm bg-primary text-on-primary rounded-lg text-label-md font-label-md font-bold shadow-level-1 hover:opacity-90 transition-opacity"
              >
                Submit Log
              </button>
            </form>
          </div>

          {/* Case History */}
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 overflow-hidden border border-surface-variant">
            <div className="px-lg py-md border-b border-surface-variant bg-surface-bright">
              <h2 className="text-headline-md font-headline-md text-primary">Case Log History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-variant">
                    {["Date", "Expected", "Actual", "Notes"].map((h) => (
                      <th key={h} className="px-lg py-sm text-label-md font-label-md text-primary font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-bright transition-colors">
                      <td className="px-lg py-md text-body-md font-body-md text-on-background font-medium">{c.date}</td>
                      <td className="px-lg py-md text-headline-md font-headline-md text-primary">{c.expected}</td>
                      <td className="px-lg py-md text-headline-md font-headline-md text-primary">{c.actual || "—"}</td>
                      <td className="px-lg py-md text-body-md font-body-md text-on-surface-variant max-w-xs truncate">{c.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Right: Ward Risk Feed (2 cols) ── */}
        <div className="lg:col-span-2 space-y-lg">
          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-lg border border-surface-variant">
            <h2 className="text-headline-md font-headline-md text-primary flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined">monitoring</span>
              Live Ward Risk Feed
            </h2>
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-lg">
              Sorted by severity · same data as Public Dashboard
            </p>

            {loading ? (
              <div className="space-y-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface-container-high rounded-lg h-16" />
                ))}
              </div>
            ) : (
              <div className="space-y-sm">
                {sortedWards.map((w) => {
                  const activeW = getEffectiveWardData(w) ?? w;
                  return (
                    <div
                      key={activeW.id}
                      className="bg-surface p-md rounded-lg border border-surface-variant flex justify-between items-center hover:shadow-level-1 transition-shadow"
                    >
                      <div>
                        <p className="text-body-md font-body-md text-on-background font-medium">{activeW.name}</p>
                        <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">
                          WBGT {activeW.heatIndex.toFixed(1)}°C · UTCI {activeW.utci.toFixed(1)}°C
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-xs">
                        <span className={`px-sm py-xs rounded-full text-label-sm font-label-sm font-bold ${RISK_STYLE[activeW.risk]}`}>
                          {activeW.risk}
                        </span>
                        <span className="text-label-sm font-label-sm text-on-surface-variant">{activeW.riskScore}/100</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-sm">
            <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-md border border-surface-variant text-center">
              <span className="material-symbols-outlined text-error text-[32px]">local_hospital</span>
              <p className="text-headline-md font-headline-md text-primary mt-xs">{cases.reduce((s, c) => s + c.expected, 0)}</p>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Total Expected</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-md border border-surface-variant text-center">
              <span className="material-symbols-outlined text-primary text-[32px]">calendar_month</span>
              <p className="text-headline-md font-headline-md text-primary mt-xs">{cases.length}</p>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Log Entries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useWeatherData } from "@/hooks/useWeatherData";
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

  return (
    <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">

      {/* Header */}
      <div className="pb-sm border-b border-surface-variant">
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-primary">
          Hospital Operations
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant mt-xs">
          Heat-case tracking and live ward risk monitoring for hospital preparedness.
        </p>
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
                {sortedWards.map((w) => (
                  <div
                    key={w.id}
                    className="bg-surface p-md rounded-lg border border-surface-variant flex justify-between items-center hover:shadow-level-1 transition-shadow"
                  >
                    <div>
                      <p className="text-body-md font-body-md text-on-background font-medium">{w.name}</p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">
                        {w.temp.toFixed(1)}°C · HI {w.heatIndex.toFixed(1)}°C
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-xs">
                      <span className={`px-sm py-xs rounded-full text-label-sm font-label-sm font-bold ${RISK_STYLE[w.risk]}`}>
                        {w.risk}
                      </span>
                      <span className="text-label-sm font-label-sm text-on-surface-variant">{w.riskScore}/100</span>
                    </div>
                  </div>
                ))}
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

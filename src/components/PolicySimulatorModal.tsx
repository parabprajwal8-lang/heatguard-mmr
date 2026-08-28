import { useState, useMemo } from "react";
import { WARDS } from "@/hooks/useWeatherData";

interface PolicySimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PolicySimulatorModal({ isOpen, onClose }: PolicySimulatorProps) {
  const [wardId, setWardId] = useState<string>("GN"); // Default Dharavi/G North

  // Intervention Sliders / Toggles
  const [coolRoofs, setCoolRoofs] = useState<number>(35); // 0-100%
  const [treeCanopy, setTreeCanopy] = useState<number>(15); // 0-50%
  const [mistingHubs, setMistingHubs] = useState<number>(12); // 0-50 units
  const [laborCurfew, setLaborCurfew] = useState<boolean>(true);

  const ward = WARDS.find((w) => w.id === wardId) ?? WARDS[0];

  // Mathematical Model (ported from policy simulator formula logic)
  const simulation = useMemo(() => {
    // Base parameters
    const baseTemp = 38.5;
    const baseUTCI = 42.8;
    const baseWBGT = 34.2;

    // Cooling cooling offsets:
    // Cool roofs: up to -1.8°C at 100%
    const coolRoofDelta = (coolRoofs / 100) * 1.8;
    // Tree canopy: up to -2.2°C at 50%
    const canopyDelta = (treeCanopy / 50) * 2.2;
    // Misting hubs: up to -1.5°C at 50 units
    const mistingDelta = (mistingHubs / 50) * 1.5;
    // Curfew reduction in effective heat exposure load: -1.0°C
    const curfewDelta = laborCurfew ? 1.0 : 0;

    const totalUtciDrop = Math.round((coolRoofDelta + canopyDelta + mistingDelta + curfewDelta) * 10) / 10;
    const postTemp = Math.round((baseTemp - totalUtciDrop * 0.7) * 10) / 10;
    const postUTCI = Math.round((baseUTCI - totalUtciDrop) * 10) / 10;
    const postWBGT = Math.round((baseWBGT - totalUtciDrop * 0.6) * 10) / 10;

    // Hospital surge drop percentage
    const hospitalSurgeDrop = Math.min(65, Math.round(totalUtciDrop * 12.5 + (laborCurfew ? 10 : 0)));

    // Citizens shielded (est. based on density & ward population)
    const rawPop = parseInt(ward.density.replace(/[^0-9]/g, ""), 10) || 30000;
    const citizensShielded = Math.round(rawPop * (totalUtciDrop / 10) * 1.2);

    // Feasibility Score calculation (0-100)
    // High canopy + high misting increases cost, lowering feasibility slightly but increasing impact
    const feasibilityScore = Math.max(
      40,
      Math.round(92 - (coolRoofs * 0.15 + treeCanopy * 0.4 + mistingHubs * 0.5 + (laborCurfew ? 5 : 0)))
    );

    return {
      baseTemp,
      baseUTCI,
      baseWBGT,
      postTemp,
      postUTCI,
      postWBGT,
      totalUtciDrop,
      hospitalSurgeDrop,
      citizensShielded,
      feasibilityScore,
    };
  }, [coolRoofs, treeCanopy, mistingHubs, laborCurfew, ward]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-md overflow-y-auto">
      <div className="bg-surface-container-lowest rounded-2xl shadow-level-2 border border-surface-variant max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-in p-lg space-y-lg">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-surface-variant pb-md">
          <div>
            <h2 className="text-headline-md font-headline-md text-primary flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                published_with_changes
              </span>
              Urban Cooling 'What-If' Policy Simulator Studio
            </h2>
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">
              Simulate microclimate intervention scenarios and forecast heat stress mitigation impact
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Ward Selector */}
        <div className="flex items-center gap-md bg-surface p-md rounded-xl border border-surface-variant">
          <label htmlFor="ward-select" className="text-label-md font-label-md text-primary font-bold shrink-0">Target Ward:</label>
          <select
            id="ward-select"
            value={wardId}
            onChange={(e) => setWardId(e.target.value)}
            className="px-md py-sm bg-surface-container border border-outline-variant rounded-lg text-body-md font-body-md text-primary focus:outline-none focus:border-primary w-full max-w-xs"
          >
            {WARDS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.zone})
              </option>
            ))}
          </select>
          <span className="text-label-sm font-label-sm text-on-surface-variant ml-auto hidden sm:inline">
            Density: {ward.density}
          </span>
        </div>

        {/* 4 Intervention Controls Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md bg-surface-bright p-md rounded-xl border border-surface-variant">
          {/* Cool Roofs */}
          <div className="space-y-xs">
            <div className="flex justify-between text-label-sm font-label-sm">
              <span className="text-primary font-bold">Cool Roofs Coverage</span>
              <span className="text-secondary font-bold">{coolRoofs}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={coolRoofs}
              onChange={(e) => setCoolRoofs(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <span className="text-[11px] text-on-surface-variant block">Albedo reflective paint on roofs</span>
          </div>

          {/* Tree Canopy Expansion */}
          <div className="space-y-xs">
            <div className="flex justify-between text-label-sm font-label-sm">
              <span className="text-primary font-bold">Tree Canopy Expansion</span>
              <span className="text-secondary font-bold">{treeCanopy}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={treeCanopy}
              onChange={(e) => setTreeCanopy(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <span className="text-[11px] text-on-surface-variant block">Urban afforestation & park shading</span>
          </div>

          {/* Misting Hubs */}
          <div className="space-y-xs">
            <div className="flex justify-between text-label-sm font-label-sm">
              <span className="text-primary font-bold">Misting Hubs</span>
              <span className="text-secondary font-bold">{mistingHubs} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={mistingHubs}
              onChange={(e) => setMistingHubs(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <span className="text-[11px] text-on-surface-variant block">Evaporative cooling stations in dense markets</span>
          </div>

          {/* Curfew Toggle */}
          <div className="flex items-center justify-between p-xs bg-surface rounded-lg border border-surface-variant">
            <div>
              <span className="text-label-sm font-label-sm text-primary font-bold block">Labor Curfew (12 PM - 4 PM)</span>
              <span className="text-[11px] text-on-surface-variant block">Mandatory outdoor work halt</span>
            </div>
            <button
              onClick={() => setLaborCurfew(!laborCurfew)}
              className={`px-md py-xs rounded-full text-label-sm font-label-sm font-bold transition-all ${
                laborCurfew ? "bg-primary text-on-primary" : "bg-surface-variant text-on-surface-variant"
              }`}
            >
              {laborCurfew ? "ACTIVE" : "OFF"}
            </button>
          </div>
        </div>

        {/* Side-by-Side Baseline vs Post-Intervention Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          {/* Baseline */}
          <div className="bg-surface p-md rounded-xl border border-surface-variant space-y-xs">
            <h4 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Current Baseline</h4>
            <div className="grid grid-cols-3 gap-xs text-center pt-xs">
              <div>
                <span className="text-[11px] text-on-surface-variant block">Temp</span>
                <span className="text-headline-md font-headline-md text-primary">{simulation.baseTemp}°C</span>
              </div>
              <div>
                <span className="text-[11px] text-on-surface-variant block">UTCI</span>
                <span className="text-headline-md font-headline-md text-error">{simulation.baseUTCI}°C</span>
              </div>
              <div>
                <span className="text-[11px] text-on-surface-variant block">WBGT</span>
                <span className="text-headline-md font-headline-md text-secondary">{simulation.baseWBGT}°C</span>
              </div>
            </div>
          </div>

          {/* Post-Intervention */}
          <div className="bg-tertiary-fixed/30 p-md rounded-xl border border-tertiary-fixed space-y-xs">
            <h4 className="text-label-sm font-label-sm text-primary font-bold uppercase tracking-wider">Post-Intervention Forecast</h4>
            <div className="grid grid-cols-3 gap-xs text-center pt-xs">
              <div>
                <span className="text-[11px] text-on-surface-variant block">Temp</span>
                <span className="text-headline-md font-headline-md text-primary">{simulation.postTemp}°C</span>
              </div>
              <div>
                <span className="text-[11px] text-on-surface-variant block">UTCI</span>
                <span className="text-headline-md font-headline-md text-primary font-bold">{simulation.postUTCI}°C</span>
              </div>
              <div>
                <span className="text-[11px] text-on-surface-variant block">WBGT</span>
                <span className="text-headline-md font-headline-md text-primary">{simulation.postWBGT}°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Impact Stat Cards */}
        <div className="grid grid-cols-3 gap-sm">
          <div className="bg-surface p-sm rounded-xl border border-surface-variant text-center">
            <span className="material-symbols-outlined text-secondary text-sm">trending_down</span>
            <span className="text-label-sm font-label-sm text-on-surface-variant block mt-xs">UTCI Thermal Drop</span>
            <span className="text-headline-md font-headline-md text-secondary font-bold">-{simulation.totalUtciDrop}°C</span>
          </div>
          <div className="bg-surface p-sm rounded-xl border border-surface-variant text-center">
            <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm">local_hospital</span>
            <span className="text-label-sm font-label-sm text-on-surface-variant block mt-xs">Hospital Surge Drop</span>
            <span className="text-headline-md font-headline-md text-primary font-bold">-{simulation.hospitalSurgeDrop}%</span>
          </div>
          <div className="bg-surface p-sm rounded-xl border border-surface-variant text-center">
            <span className="material-symbols-outlined text-primary text-sm">shield</span>
            <span className="text-label-sm font-label-sm text-on-surface-variant block mt-xs">Citizens Shielded</span>
            <span className="text-headline-md font-headline-md text-primary font-bold">{simulation.citizensShielded.toLocaleString()}</span>
          </div>
        </div>

        {/* Feasibility Score & Findings */}
        <div className="bg-surface p-md rounded-xl border border-surface-variant flex flex-col sm:flex-row items-center gap-md">
          <div className="w-24 h-24 rounded-full border-4 border-primary flex flex-col items-center justify-center shrink-0">
            <span className="text-headline-lg font-headline-lg text-primary font-bold">{simulation.feasibilityScore}</span>
            <span className="text-[10px] text-on-surface-variant uppercase">Feasibility</span>
          </div>
          <div className="space-y-xs text-body-md font-body-md text-on-surface-variant">
            <p className="font-bold text-primary">Simulation Key Findings:</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>Cool roof painting on high-density metal roofs yields immediate -1.8°C thermal relief.</li>
              <li>Evaporative misting stations significantly lower peak outdoor wet-bulb globe temperature.</li>
              <li>Enforcing 12 PM - 4 PM labor curfew drops heatstroke admissions by ~{simulation.hospitalSurgeDrop}%.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

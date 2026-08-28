import { useState } from "react";
import type { Advisory } from "@/hooks/useAdvisory";
import InteractiveBodyMannequin, { type OrganKey } from "@/components/InteractiveBodyMannequin";

interface HumanBodyMeterProps {
  riskLevel: string;
  riskScore: number;
  advisory: Advisory | null;
}

export default function HumanBodyMeter({ riskLevel, riskScore, advisory }: HumanBodyMeterProps) {
  const isHighOrExtreme = riskScore >= 50 || riskLevel === "Extreme" || riskLevel === "High";
  const [activeOrgan, setActiveOrgan] = useState<OrganKey>("brain");

  // Hydration specs per demographic
  const hydrationData = [
    {
      group: "Adults",
      icon: "person",
      amount: advisory?.hydration?.adults || (isHighOrExtreme ? "4.0 - 4.5 L / day" : "3.0 - 3.5 L / day"),
      tip: "Drink 250ml every 20-30 mins when outdoors",
      badgeBg: "bg-primary-container text-on-primary-container",
    },
    {
      group: "Children",
      icon: "child_care",
      amount: advisory?.hydration?.children || (isHighOrExtreme ? "2.5 - 3.0 L / day" : "1.8 - 2.2 L / day"),
      tip: "Frequent sip reminders; offer water & fresh juices",
      badgeBg: "bg-secondary-container text-on-secondary-container",
    },
    {
      group: "Elderly (60+)",
      icon: "elderly",
      amount: advisory?.hydration?.elderly || (isHighOrExtreme ? "3.0 - 3.5 L + ORS" : "2.2 - 2.7 L / day"),
      tip: "Thirst sensation decreases with age; add ORS electrolytes",
      badgeBg: "bg-tertiary-fixed text-on-tertiary-fixed",
    },
  ];

  return (
    <div className="bg-surface p-md rounded-xl border border-surface-variant space-y-md">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h4 className="text-label-md font-label-md text-primary uppercase tracking-wider flex items-center gap-xs">
          <span className="material-symbols-outlined text-sm text-secondary">body_system</span>
          Thermal Body Impact & Hydration Meter
        </h4>
        <span className="text-label-sm font-label-sm px-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant">
          Interactive Medical Reference
        </span>
      </div>

      {/* Interactive Vector Mannequin */}
      <div className="bg-surface-bright rounded-xl p-md border border-surface-variant flex flex-col items-center">
        <InteractiveBodyMannequin
          activeOrgan={activeOrgan}
          onSelectOrgan={setActiveOrgan}
          riskLevel={riskLevel}
        />
      </div>

      {/* Demographics Water Intake Guidelines */}
      <div className="space-y-xs pt-xs border-t border-surface-variant">
        <h5 className="text-label-sm font-label-sm text-primary font-bold uppercase tracking-wider flex items-center gap-xs">
          <span className="material-symbols-outlined text-sm text-primary">water_drop</span>
          Target Water Intake (by Age Group)
        </h5>

        <div className="grid grid-cols-1 gap-xs">
          {hydrationData.map((item) => (
            <div
              key={item.group}
              className="p-sm bg-surface-container-lowest rounded-lg border border-surface-variant flex items-center justify-between gap-sm"
            >
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-full bg-primary-container/40 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm text-primary">{item.icon}</span>
                </div>
                <div>
                  <span className="text-label-sm font-label-sm font-bold text-primary block leading-tight">{item.group}</span>
                  <span className="text-[11px] text-on-surface-variant block">{item.tip}</span>
                </div>
              </div>

              <span className={`px-2 py-1 rounded-md text-label-sm font-label-sm font-bold shrink-0 ${item.badgeBg}`}>
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

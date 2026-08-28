import type { Advisory } from "@/hooks/useAdvisory";

interface HumanBodyMeterProps {
  riskLevel: string;
  riskScore: number;
  advisory: Advisory | null;
}

export default function HumanBodyMeter({ riskLevel, riskScore, advisory }: HumanBodyMeterProps) {
  const isHighOrExtreme = riskScore >= 50 || riskLevel === "Extreme" || riskLevel === "High";

  // Physiological stress tags based on risk score
  const bodyTags = [
    {
      label: "Brain & CNS",
      desc: isHighOrExtreme ? "High Risk: Dizziness, confusion, heat syncope" : "Mild Risk: Occasional fatigue & headaches",
      pos: "top-[12%] left-[55%]",
      tagColor: isHighOrExtreme ? "bg-error text-white" : "bg-primary text-white",
      icon: "psychology",
    },
    {
      label: "Heart & Vascular",
      desc: isHighOrExtreme ? "Elevated HR, extreme circulatory strain" : "Normal increase in skin blood flow",
      pos: "top-[28%] left-[55%]",
      tagColor: isHighOrExtreme ? "bg-secondary text-white" : "bg-primary text-white",
      icon: "favorite",
    },
    {
      label: "Kidneys & Urinary",
      desc: isHighOrExtreme ? "High dehydration: Dark urine, renal stress" : "Standard filtration, maintain fluids",
      pos: "top-[42%] left-[55%]",
      tagColor: isHighOrExtreme ? "bg-[#dd6b20] text-white" : "bg-primary text-white",
      icon: "water_drop",
    },
    {
      label: "Muscles & Skin",
      desc: isHighOrExtreme ? "Heat cramps, heavy sweating / thermal fatigue" : "Normal perspiration",
      pos: "top-[58%] left-[55%]",
      tagColor: isHighOrExtreme ? "bg-secondary text-white" : "bg-primary text-white",
      icon: "fitness_center",
    },
  ];

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
          Medical Reference
        </span>
      </div>

      {/* Body Diagram with anatomical tag pins */}
      <div className="relative bg-surface-bright rounded-lg p-md border border-surface-variant flex flex-col md:flex-row items-center gap-md">
        {/* Human Body Image Container */}
        <div className="relative w-44 h-64 shrink-0 flex items-center justify-center bg-white/60 rounded-md border border-outline-variant p-2">
          <img
            src="/human_body_outline.png"
            alt="Human Body Medical Outline"
            className="h-full object-contain filter drop-shadow-sm opacity-90"
          />

          {/* Pulse indicators on diagram */}
          <div className="absolute top-[12%] left-[48%] w-3 h-3 bg-error rounded-full animate-ping opacity-75" />
          <div className="absolute top-[28%] left-[48%] w-3 h-3 bg-secondary rounded-full animate-ping opacity-75" />
          <div className="absolute top-[42%] left-[48%] w-3 h-3 bg-[#dd6b20] rounded-full animate-ping opacity-75" />
        </div>

        {/* Tagged Body Impact Breakdown */}
        <div className="flex-1 space-y-xs w-full">
          {bodyTags.map((tag) => (
            <div
              key={tag.label}
              className="p-xs bg-surface-container-lowest rounded-md border border-surface-variant text-left hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-label-sm font-label-sm font-bold text-primary flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">{tag.icon}</span>
                  {tag.label}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${tag.tagColor}`}>
                  {isHighOrExtreme ? "STRESS" : "NORMAL"}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-tight">{tag.desc}</p>
            </div>
          ))}
        </div>
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

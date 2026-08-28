import { useState } from "react";
import { useScenario } from "@/context/ScenarioContext";
import type { WardWeather } from "@/hooks/useWeatherData";
import InteractiveBodyMannequin, { type OrganKey } from "@/components/InteractiveBodyMannequin";

type AgeGroup = "children" | "adults" | "elderly";

interface OrganInfo {
  name: string;
  icon: string;
  manifestations: Record<AgeGroup, { title: string; desc: string; risk: "Low" | "Moderate" | "High" | "Critical" }>;
}

const ORGANS: Record<OrganKey, OrganInfo> = {
  brain: {
    name: "Brain & Nervous System",
    icon: "psychology",
    manifestations: {
      children: { title: "Pediatric Thermal Distress", desc: "Extreme irritability, febrile seizures, lethargy, rapid elevation in core head temp.", risk: "Critical" },
      adults: { title: "Central Thermoregulatory Failure", desc: "Heat syncope, disorientation, ataxia, high risk of heat stroke (>40.5°C core temp).", risk: "Critical" },
      elderly: { title: "Cerebrovascular Collapse", desc: "Severe delirium, confusion, transient ischemic attacks, rapid neurological impairment.", risk: "Critical" },
    },
  },
  heart: {
    name: "Heart & Cardiovascular System",
    icon: "favorite",
    manifestations: {
      children: { title: "Compensatory Tachycardia", desc: "Heart rate increases >160 bpm to drive cutaneous cooling; rapid exhaustion.", risk: "High" },
      adults: { title: "Cardiovascular Workload Surge", desc: "Extreme stroke volume strain, peripheral vasodilation leading to sudden BP drop.", risk: "High" },
      elderly: { title: "Myocardial Stress & Failure", desc: "High risk of acute coronary syndrome, arrhythmia, and cardiovascular collapse.", risk: "Critical" },
    },
  },
  kidneys: {
    name: "Kidneys & Renal Function",
    icon: "water_drop",
    manifestations: {
      children: { title: "Rapid Dehydration Oliguria", desc: "Concentrated urine, electrolyte imbalance, swift acute kidney stress.", risk: "High" },
      adults: { title: "Rhabdomyolysis Renal Toxicity", desc: "Myoglobin accumulation from muscle breakdown causing acute tubular necrosis.", risk: "Critical" },
      elderly: { title: "Renal Failure & Anuria", desc: "Pre-renal azotemia, rapid filtration collapse, electrolyte toxicity.", risk: "Critical" },
    },
  },
  skin: {
    name: "Skin & Sweat Glands",
    icon: "dermatology",
    manifestations: {
      children: { title: "Sudamina & Heat Rash", desc: "Miliaria rubra, sweat gland blockage, inability to shed heat efficiently.", risk: "Moderate" },
      adults: { title: "Cutaneous Vasodilation / Anhidrosis", desc: "Profuse sweating early on, leading to anhidrosis (sweat shutoff) in extreme heat.", risk: "High" },
      elderly: { title: "Impaired Sweating Capacity", desc: "Atrophied sweat glands yield minimal evaporative cooling, accelerating overheating.", risk: "Critical" },
    },
  },
  muscles: {
    name: "Skeletal Muscles",
    icon: "fitness_center",
    manifestations: {
      children: { title: "Muscle Cramps & Spasms", desc: "Sodium and electrolyte depletion causing painful abdominal and limb cramps.", risk: "Moderate" },
      adults: { title: "Exertional Rhabdomyolysis", desc: "Severe muscle breakdown, cell membrane perforation, micro-tears.", risk: "High" },
      elderly: { title: "Sarcopenic Muscle Rigidity", desc: "Severe cramps, extreme weakness, mobility loss preventing self-evacuation.", risk: "High" },
    },
  },
};

export default function OrganVisualizer({ ward }: { ward?: WardWeather }) {
  const { scenarioActive, simulatedIndex, getEffectiveWardData } = useScenario();
  const effectiveWard = getEffectiveWardData(ward);

  const [selectedAge, setSelectedAge] = useState<AgeGroup>("adults");
  const [activeOrgan, setActiveOrgan] = useState<OrganKey>("brain");

  // Effective index (WBGT/UTCI)
  const currentUTCI = scenarioActive ? simulatedIndex : (effectiveWard?.utci ?? 38.5);

  // Computations based on age + currentUTCI
  const waterGoal = selectedAge === "children"
    ? Math.round((2.0 + (currentUTCI > 40 ? 1.0 : 0.4)) * 10) / 10
    : selectedAge === "elderly"
    ? Math.round((2.8 + (currentUTCI > 40 ? 1.2 : 0.5)) * 10) / 10
    : Math.round((3.8 + (currentUTCI > 40 ? 1.5 : 0.6)) * 10) / 10;

  const sweatLossRate = selectedAge === "children"
    ? Math.round((0.6 + (currentUTCI / 50) * 0.8) * 10) / 10
    : selectedAge === "elderly"
    ? Math.round((0.8 + (currentUTCI / 50) * 0.9) * 10) / 10
    : Math.round((1.4 + (currentUTCI / 50) * 1.3) * 10) / 10;

  const coreBodyTemp = Math.round((37.0 + Math.max(0, (currentUTCI - 32) * 0.12)) * 10) / 10;

  const organData = ORGANS[activeOrgan];
  const manifestation = organData.manifestations[selectedAge];

  const directives: Record<AgeGroup, string> = {
    children: "Keep indoors between 11 AM - 4 PM. Provide electrolyte fluids every 20 minutes even without thirst complaints.",
    adults: "Mandatory 15-minute shade rest per hour for outdoor workers. Hydrate with 250ml water + ORS continuously.",
    elderly: "Ensure active air circulation / cooling centers. Monitor for confusion or dry skin — seek immediate emergency help if present.",
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-level-1 p-lg border border-surface-variant space-y-md">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm border-b border-surface-variant pb-md">
        <div>
          <h2 className="text-headline-md font-headline-md text-primary flex items-center gap-xs">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              accessibility_new
            </span>
            Age-Based Human Thermal Stress & Organ Response Visualizer
          </h2>
          <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">
            Clinical physiological breakdown of thermal load by demographic
          </p>
        </div>
        <div className="flex items-center gap-xs bg-surface p-1 rounded-lg border border-surface-variant">
          {[
            { id: "children" as const, label: "Infants (0-12y)" },
            { id: "adults" as const, label: "Adults (13-59y)" },
            { id: "elderly" as const, label: "Elderly (60+y)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedAge(tab.id)}
              className={`px-sm py-xs rounded text-label-sm font-label-sm transition-all ${
                selectedAge === tab.id
                  ? "bg-primary text-on-primary font-bold shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-bright"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Index Banner */}
      <div className="bg-surface p-md rounded-lg border border-surface-variant flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary">device_thermostat</span>
          <div>
            <span className="text-label-sm font-label-sm text-on-surface-variant block">Effective Thermal Load (UTCI)</span>
            <span className="text-headline-md font-headline-md text-primary">{currentUTCI}°C</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-label-sm font-label-sm text-on-surface-variant block">Target Demographic</span>
          <span className="text-label-md font-label-md text-secondary font-bold capitalize">{selectedAge}</span>
        </div>
      </div>

      {/* Main Grid: Interactive Body Mannequin + Organ Manifestation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-center">
        {/* Left: Interactive Mannequin Model (5 cols) */}
        <div className="md:col-span-5 bg-surface-bright rounded-xl p-md border border-surface-variant flex flex-col items-center">
          <InteractiveBodyMannequin
            activeOrgan={activeOrgan}
            onSelectOrgan={setActiveOrgan}
            riskLevel={effectiveWard?.risk}
          />
        </div>

        {/* Right: Organ Response Panel (7 cols) */}
        <div className="md:col-span-7 space-y-md">
          <div className="bg-surface p-md rounded-xl border border-surface-variant">
            <div className="flex items-center justify-between mb-sm">
              <span className="text-headline-md font-headline-md text-primary flex items-center gap-xs">
                <span className="material-symbols-outlined text-secondary">{organData.icon}</span>
                {organData.name}
              </span>
              <span
                className={`px-md py-xs rounded-full text-label-sm font-label-sm font-bold ${
                  manifestation.risk === "Critical"
                    ? "bg-error-container text-on-error-container border border-secondary-fixed"
                    : manifestation.risk === "High"
                    ? "bg-[#feebc8] text-[#dd6b20]"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {manifestation.risk} Risk
              </span>
            </div>

            <h4 className="text-label-md font-label-md text-secondary font-bold mb-xs">{manifestation.title}</h4>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">{manifestation.desc}</p>
          </div>

          {/* 3 Stat Cards */}
          <div className="grid grid-cols-3 gap-sm">
            <div className="bg-surface p-sm rounded-lg border border-surface-variant text-center">
              <span className="material-symbols-outlined text-primary text-sm">water_drop</span>
              <span className="text-label-sm font-label-sm text-on-surface-variant block mt-xs">Daily Water Goal</span>
              <span className="text-headline-md font-headline-md text-primary font-bold">{waterGoal} L</span>
            </div>
            <div className="bg-surface p-sm rounded-lg border border-surface-variant text-center">
              <span className="material-symbols-outlined text-secondary text-sm">humidity_mid</span>
              <span className="text-label-sm font-label-sm text-on-surface-variant block mt-xs">Sweat Loss Rate</span>
              <span className="text-headline-md font-headline-md text-secondary font-bold">{sweatLossRate} L/hr</span>
            </div>
            <div className="bg-surface p-sm rounded-lg border border-surface-variant text-center">
              <span className="material-symbols-outlined text-error text-sm">thermostat</span>
              <span className="text-label-sm font-label-sm text-on-surface-variant block mt-xs">Est. Core Temp</span>
              <span className="text-headline-md font-headline-md text-error font-bold">{coreBodyTemp}°C</span>
            </div>
          </div>

          {/* Age-Specific Precaution Directive */}
          <div className="bg-primary-container/30 border border-primary/20 rounded-xl p-md">
            <h5 className="text-label-sm font-label-sm text-primary font-bold uppercase tracking-wider flex items-center gap-xs mb-xs">
              <span className="material-symbols-outlined text-sm">shield</span>
              Age-Specific Directive ({selectedAge})
            </h5>
            <p className="text-body-md font-body-md text-primary leading-relaxed">{directives[selectedAge]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

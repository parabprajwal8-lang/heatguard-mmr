export type OrganKey = "brain" | "heart" | "kidneys" | "skin" | "muscles";

interface MannequinProps {
  activeOrgan: OrganKey;
  onSelectOrgan: (key: OrganKey) => void;
  riskLevel?: string;
}

const ORGAN_NODES: { key: OrganKey; label: string; icon: string; top: string; left: string; activeColor: string }[] = [
  { key: "brain", label: "Brain", icon: "psychology", top: "12%", left: "50%", activeColor: "bg-error text-white ring-error/40" },
  { key: "heart", label: "Heart", icon: "favorite", top: "28%", left: "50%", activeColor: "bg-[#dd6b20] text-white ring-[#dd6b20]/40" },
  { key: "kidneys", label: "Kidneys", icon: "water_drop", top: "42%", left: "50%", activeColor: "bg-amber-500 text-white ring-amber-500/40" },
  { key: "skin", label: "Skin", icon: "dermatology", top: "54%", left: "50%", activeColor: "bg-cyan-500 text-white ring-cyan-500/40" },
  { key: "muscles", label: "Muscles", icon: "fitness_center", top: "68%", left: "50%", activeColor: "bg-purple-600 text-white ring-purple-600/40" },
];

export default function InteractiveBodyMannequin({ activeOrgan, onSelectOrgan }: MannequinProps) {
  return (
    <div className="flex flex-col items-center w-full space-y-md">
      {/* Vector Mannequin Container */}
      <div className="relative w-56 h-84 bg-surface-bright rounded-2xl border border-surface-variant p-4 flex flex-col items-center justify-between shadow-inner overflow-hidden">

        {/* Heat Gradient Overlay (Core Heat Zones) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-28 bg-gradient-radial from-error/30 via-amber-500/20 to-transparent rounded-full pointer-events-none blur-md" />
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-32 h-36 bg-gradient-radial from-amber-500/25 via-error/15 to-transparent rounded-full pointer-events-none blur-md" />

        {/* Clean SVG Vector Human Mannequin Silhouette */}
        <svg
          viewBox="0 0 100 200"
          className="w-full h-72 text-on-surface-variant/30 fill-current filter drop-shadow"
        >
          {/* Head */}
          <circle cx="50" cy="18" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
          {/* Neck */}
          <rect x="47" y="28" width="6" height="6" rx="2" fill="currentColor" fillOpacity="0.2" />
          {/* Torso */}
          <path
            d="M 32,34 L 68,34 L 62,95 L 38,95 Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            fillOpacity="0.15"
          />
          {/* Arms Left & Right */}
          <path
            d="M 30,34 L 20,68 L 16,98 L 22,98 L 26,70 L 32,45 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M 70,34 L 80,68 L 84,98 L 78,98 L 74,70 L 68,45 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.15"
          />
          {/* Legs Left & Right */}
          <path
            d="M 38,95 L 34,145 L 32,185 L 42,185 L 45,145 L 48,95 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M 62,95 L 66,145 L 68,185 L 58,185 L 55,145 L 52,95 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="currentColor"
            fillOpacity="0.15"
          />
        </svg>

        {/* 5 Interactive Organ Nodes */}
        {ORGAN_NODES.map((node) => {
          const isSelected = activeOrgan === node.key;
          return (
            <button
              key={node.key}
              onClick={() => onSelectOrgan(node.key)}
              style={{ top: node.top, left: node.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                isSelected
                  ? `${node.activeColor} ring-4 scale-125 z-20 shadow-lg animate-pulse`
                  : "bg-surface-container-lowest text-primary border border-outline-variant hover:scale-110 z-10 shadow-sm"
              }`}
              title={`Click to inspect ${node.label}`}
            >
              <span className="material-symbols-outlined text-[18px]">{node.icon}</span>
            </button>
          );
        })}

        <span className="text-[10px] font-bold text-on-surface-variant/60 tracking-widest uppercase relative z-10 mt-auto">
          CORE HEAT ZONES
        </span>
      </div>

      {/* Bottom Organ Pill Buttons (matching reference image #2) */}
      <div className="flex items-center gap-xs flex-wrap justify-center bg-surface p-1.5 rounded-xl border border-surface-variant">
        {ORGAN_NODES.map((node) => {
          const isSelected = activeOrgan === node.key;
          return (
            <button
              key={node.key}
              onClick={() => onSelectOrgan(node.key)}
              className={`px-md py-1.5 rounded-lg text-label-sm font-label-sm font-bold transition-all flex items-center gap-xs ${
                isSelected
                  ? "bg-secondary text-on-secondary shadow-md scale-105"
                  : "text-on-surface-variant hover:bg-surface-bright hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{node.icon}</span>
              {node.label}
            </button>
          );
        })}
      </div>

      {/* Instruction text matching reference image */}
      <p className="text-label-sm font-label-sm text-on-surface-variant text-center flex items-center gap-xs">
        <span className="material-symbols-outlined text-sm text-secondary">touch_app</span>
        Click any organ pin to inspect physiological response
      </p>
    </div>
  );
}

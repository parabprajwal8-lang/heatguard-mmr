import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useScenario } from "@/context/ScenarioContext";
import PolicySimulatorModal from "@/components/PolicySimulatorModal";

const navLinks = [
  { to: "/", label: "Dashboard", icon: "dashboard" },
  { to: "/admin", label: "Admin", icon: "admin_panel_settings" },
  { to: "/hospital", label: "Hospital", icon: "local_hospital" },
] as const;

export default function Navbar() {
  const { scenarioActive, setScenarioActive, simulatedIndex, setSimulatedIndex } = useScenario();
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface-container-lowest shadow-level-1 border-b border-surface-variant">
        <div className="flex items-center gap-md">
          {/* App Name */}
          <NavLink
            to="/"
            className="text-headline-md font-headline-md font-bold text-primary flex items-center gap-xs shrink-0"
          >
            <span
              className="material-symbols-outlined text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              thermostat
            </span>
            <span className="hidden sm:inline">HeatGuard MMR</span>
            <span className="sm:hidden">HG</span>
          </NavLink>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-xs ml-md">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  [
                    "text-label-md font-label-md px-md py-sm rounded-md transition-all duration-200 flex items-center gap-xs",
                    isActive
                      ? "bg-primary-container text-on-primary-container font-bold"
                      : "text-on-surface-variant hover:bg-surface-bright hover:text-primary",
                  ].join(" ")
                }
              >
                <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-sm">
          {/* Scenario Simulator Toggle (Phase 6) */}
          <div className="flex items-center gap-xs bg-surface p-1 rounded-lg border border-surface-variant">
            <button
              onClick={() => setScenarioActive(!scenarioActive)}
              className={`px-xs py-1 rounded text-label-sm font-label-sm font-bold flex items-center gap-xs transition-all ${
                scenarioActive ? "bg-secondary text-on-secondary shadow-sm" : "text-on-surface-variant hover:bg-surface-bright"
              }`}
              title="Toggle Scenario Simulator ON/OFF"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              <span className="hidden sm:inline">{scenarioActive ? "SIMULATOR: ON" : "DEMO SIMULATOR"}</span>
              <span className="sm:hidden">{scenarioActive ? "SIM ON" : "SIM"}</span>
            </button>

            {scenarioActive && (
              <div className="flex items-center gap-xs px-xs border-l border-surface-variant">
                <input
                  type="range"
                  min="30"
                  max="55"
                  step="0.5"
                  value={simulatedIndex}
                  onChange={(e) => setSimulatedIndex(Number(e.target.value))}
                  className="w-20 sm:w-28 accent-secondary"
                />
                <span className="text-label-sm font-label-sm font-bold text-secondary w-10 text-right">{simulatedIndex}°C</span>
              </div>
            )}
          </div>

          {/* Urban Cooling Policy Studio Button (Phase 9) */}
          <button
            onClick={() => setIsPolicyModalOpen(true)}
            className="px-xs py-1 bg-primary text-on-primary rounded-lg text-label-sm font-label-sm font-bold flex items-center gap-xs hover:opacity-90 transition-opacity"
            title="Open Policy Simulator Studio"
          >
            <span className="material-symbols-outlined text-sm">published_with_changes</span>
            <span className="hidden lg:inline">Policy Studio</span>
          </button>

          {/* Mobile nav */}
          <div className="md:hidden flex items-center gap-xs">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  [
                    "text-label-sm font-label-sm px-sm py-xs rounded transition-colors flex items-center gap-xs",
                    isActive
                      ? "bg-primary-container text-on-primary-container font-bold"
                      : "text-on-surface-variant",
                  ].join(" ")
                }
              >
                <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Policy Simulator Modal */}
      <PolicySimulatorModal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} />
    </>
  );
}

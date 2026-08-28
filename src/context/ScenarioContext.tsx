import React, { createContext, useContext, useState } from "react";
import type { WardWeather } from "@/hooks/useWeatherData";

interface ScenarioContextType {
  selectedWardId: string | null;
  setSelectedWardId: (id: string | null) => void;
  scenarioActive: boolean;
  setScenarioActive: (active: boolean) => void;
  simulatedIndex: number; // 30°C to 55°C
  setSimulatedIndex: (val: number) => void;
  getEffectiveWardData: (ward: WardWeather | undefined) => WardWeather | undefined;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [selectedWardId, setSelectedWardId] = useState<string | null>("GN"); // Default Dharavi/G North
  const [scenarioActive, setScenarioActive] = useState<boolean>(false);
  const [simulatedIndex, setSimulatedIndex] = useState<number>(45.0);

  const getEffectiveWardData = (ward: WardWeather | undefined): WardWeather | undefined => {
    if (!ward) return undefined;
    if (!scenarioActive) return ward;

    // Derived simulated values based on simulatedIndex
    const simHI = Math.round(simulatedIndex * 10) / 10;
    const simUTCI = Math.round((simulatedIndex * 0.95 + 1.2) * 10) / 10;
    let simScore = 20;
    if (simHI < 27) simScore = Math.round((simHI / 27) * 20);
    else if (simHI < 32) simScore = Math.round(20 + ((simHI - 27) / 5) * 20);
    else if (simHI < 41) simScore = Math.round(40 + ((simHI - 32) / 9) * 20);
    else if (simHI < 54) simScore = Math.round(60 + ((simHI - 41) / 13) * 20);
    else simScore = Math.min(100, Math.round(80 + ((simHI - 54) / 10) * 20));

    let simRisk: "Low" | "Moderate" | "High" | "Extreme" = "Low";
    if (simScore <= 20) simRisk = "Low";
    else if (simScore <= 40) simRisk = "Moderate";
    else if (simScore <= 60) simRisk = "High";
    else simRisk = "Extreme";

    return {
      ...ward,
      heatIndex: simHI,
      utci: simUTCI,
      riskScore: simScore,
      risk: simRisk,
      temp: Math.round((simHI * 0.88 + 3) * 10) / 10,
    };
  };

  return (
    <ScenarioContext.Provider
      value={{
        selectedWardId,
        setSelectedWardId,
        scenarioActive,
        setScenarioActive,
        simulatedIndex,
        setSimulatedIndex,
        getEffectiveWardData,
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (!context) {
    throw new Error("useScenario must be used within a ScenarioProvider");
  }
  return context;
}

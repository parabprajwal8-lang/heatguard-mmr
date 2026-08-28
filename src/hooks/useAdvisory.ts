import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

export interface Advisory {
  summary: string;
  dos: string[];
  donts: string[];
  hydration: {
    adults: string;
    children: string;
    elderly: string;
  };
}

export function generateDynamicAdvisory(
  wardName: string,
  risk: string,
  riskScore: number,
  temp: number,
  heatIndex: number
): Advisory {
  const isExtreme = risk === "Extreme" || riskScore >= 70;
  const isHigh = risk === "High" || (riskScore >= 45 && riskScore < 70);
  const isModerate = risk === "Moderate" || (riskScore >= 25 && riskScore < 45);

  let summary = "";
  let dos: string[] = [];
  let donts: string[] = [];
  let hydration = {
    adults: "3.0 - 3.5 Liters / day",
    children: "1.5 - 2.0 Liters / day",
    elderly: "2.0 - 2.5 Liters + ORS",
  };

  if (isExtreme) {
    summary = `CRITICAL HEAT ALERT for ${wardName}. The Human Thermal Stress Index has reached ${heatIndex.toFixed(
      1
    )}°C (Temp: ${temp.toFixed(
      1
    )}°C). Immediate action is required to avoid severe heat exhaustion, heat stroke, and dehydration.`;
    dos = [
      "Drink 250ml water every 20 minutes even if not thirsty",
      "Seek air-conditioned cooling centers or deep shade immediately",
      "Use wet towels on neck, armpits, and forehead to lower core temp",
    ];
    donts = [
      "Avoid direct outdoor exposure between 11:00 AM and 4:30 PM",
      "Do not engage in heavy physical labor or strenuous workouts outdoors",
      "Avoid caffeinated, sugary, or alcoholic beverages which worsen dehydration",
    ];
    hydration = {
      adults: "4.5 - 5.0 Liters / day (Add ORS/Electrolytes)",
      children: "2.5 - 3.0 Liters / day (Frequent sip reminders)",
      elderly: "3.0 - 3.5 Liters / day (Monitor electrolyte levels)",
    };
  } else if (isHigh) {
    summary = `HIGH HEAT WARNING in ${wardName}. Thermal index stands at ${heatIndex.toFixed(
      1
    )}°C with high humidity. Extended outdoor activity carries significant risk of heat cramps and fatigue.`;
    dos = [
      "Maintain active hydration throughout the day with electrolyte fluids",
      "Wear light-colored, loose-fitting cotton clothing and wide-brim hats",
      "Schedule necessary outdoor tasks before 10:00 AM or after 5:00 PM",
    ];
    donts = [
      "Don't leave children, elderly, or pets inside parked vehicles",
      "Avoid heavy protein meals during peak heat hours",
      "Do not ignore dizziness, excessive sweating, or nausea",
    ];
    hydration = {
      adults: "3.5 - 4.0 Liters / day",
      children: "2.0 - 2.5 Liters / day",
      elderly: "2.5 - 3.0 Liters / day + Lemon water/ORS",
    };
  } else if (isModerate) {
    summary = `MODERATE HEAT ADVISORY for ${wardName}. Heat index is ${heatIndex.toFixed(
      1
    )}°C. Normal activities may proceed with caution, ensuring regular water breaks.`;
    dos = [
      "Carry a reusable water bottle when traveling outside",
      "Take periodic 10-minute rest breaks in shaded areas",
      "Ensure proper ventilation in indoor work spaces",
    ];
    donts = [
      "Don't skip meals or hydration during daytime travel",
      "Avoid prolonged direct sunlight without head cover",
      "Don't delay drinking water until feeling thirsty",
    ];
    hydration = {
      adults: "3.0 - 3.5 Liters / day",
      children: "1.8 - 2.2 Liters / day",
      elderly: "2.2 - 2.7 Liters / day",
    };
  } else {
    summary = `LOW HEAT RISK in ${wardName}. Heat Index is at a manageable ${heatIndex.toFixed(
      1
    )}°C. Maintain baseline healthy hydration and hygiene practices.`;
    dos = [
      "Maintain standard daily fluid intake",
      "Enjoy outdoor activities with routine sun protection",
      "Keep living areas ventilated",
    ];
    donts = [
      "Don't forget sun protection during midday UV peak",
      "Avoid unhygienic street beverage vendors",
      "Don't ignore hydration if working physically",
    ];
    hydration = {
      adults: "2.5 - 3.0 Liters / day",
      children: "1.5 - 2.0 Liters / day",
      elderly: "2.0 - 2.5 Liters / day",
    };
  }

  return { summary, dos, donts, hydration };
}

export function useAdvisory(
  wardName: string | null,
  risk: string | null,
  riskScore: number | null,
  temp: number | null,
  heatIndex: number | null
) {
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wardName || !risk || riskScore == null || temp == null || heatIndex == null) {
      setAdvisory(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const defaultAdv = generateDynamicAdvisory(wardName, risk, riskScore, temp, heatIndex);

    // Try Gemini API if API key exists
    if (API_KEY && API_KEY.trim().length > 10) {
      const prompt = `You are a public health advisory system for Mumbai heatwaves. Be authoritative yet calm.
Ward: ${wardName}
Risk level: ${risk} (score ${riskScore}/100)
Temperature: ${temp.toFixed(1)}°C
Heat Index: ${heatIndex.toFixed(1)}°C

Respond in this exact JSON format only, no markdown fencing:
{
  "summary": "2-3 sentence public health advisory about current conditions in this ward.",
  "dos": ["do 1", "do 2", "do 3"],
  "donts": ["dont 1", "dont 2", "dont 3"],
  "hydration": {
    "adults": "X.X - Y.Y Liters / day",
    "children": "X.X - Y.Y Liters / day",
    "elderly": "X.X - Y.Y Liters / day"
  }
}`;

      // Try gemini-1.5-flash or gemini-2.0-flash
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
        }),
      })
        .then((r) => {
          if (!r.ok) throw new Error(`Gemini API ${r.status}`);
          return r.json();
        })
        .then((data) => {
          if (cancelled) return;
          const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          const clean = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(clean);
          setAdvisory({
            summary: parsed.summary || defaultAdv.summary,
            dos: Array.isArray(parsed.dos) ? parsed.dos : defaultAdv.dos,
            donts: Array.isArray(parsed.donts) ? parsed.donts : defaultAdv.donts,
            hydration: parsed.hydration || defaultAdv.hydration,
          });
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          // Use high quality dynamic advisory fallback without showing an ugly error box
          setAdvisory(defaultAdv);
          setLoading(false);
        });
    } else {
      // Use dynamic fallback immediately
      setTimeout(() => {
        if (!cancelled) {
          setAdvisory(defaultAdv);
          setLoading(false);
        }
      }, 150);
    }

    return () => {
      cancelled = true;
    };
  }, [wardName, risk, riskScore, temp, heatIndex]);

  return { advisory, loading, error };
}

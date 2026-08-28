// ── NOAA Heat Index (Rothfusz regression) ─────────────────────────────────
// Inputs: temp in °C, relativeHumidity in %
// Returns: Heat Index in °C

function celsiusToF(c: number) { return c * 9 / 5 + 32; }
function fToCelsius(f: number) { return (f - 32) * 5 / 9; }

export function calcHeatIndex(tempC: number, rh: number): number {
  const T = celsiusToF(tempC);
  // Use simple formula for low temps or dry conditions
  if (T < 80 || rh < 40) {
    const hi = 0.5 * (T + 61 + (T - 68) * 1.2 + rh * 0.094);
    return fToCelsius(hi);
  }
  // Rothfusz full regression
  let HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * rh -
    0.22475541 * T * rh -
    0.00683783 * T * T -
    0.05481717 * rh * rh +
    0.00122874 * T * T * rh +
    0.00085282 * T * rh * rh -
    0.00000199 * T * T * rh * rh;

  // Adjustments
  if (rh < 13 && T >= 80 && T <= 112) HI -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
  if (rh > 85 && T >= 80 && T <= 87) HI += ((rh - 85) / 10) * ((87 - T) / 5);

  return fToCelsius(HI);
}

// ── Risk score 0-100 from Heat Index ──────────────────────────────────────
export function hiToRiskScore(hi: number): number {
  if (hi < 27) return Math.round((hi / 27) * 20);
  if (hi < 32) return Math.round(20 + ((hi - 27) / 5) * 20);
  if (hi < 41) return Math.round(40 + ((hi - 32) / 9) * 20);
  if (hi < 54) return Math.round(60 + ((hi - 41) / 13) * 20);
  return Math.min(100, Math.round(80 + ((hi - 54) / 10) * 20));
}

export type RiskBand = "Low" | "Moderate" | "High" | "Extreme";

export function scoreToBand(score: number): RiskBand {
  if (score <= 20) return "Low";
  if (score <= 40) return "Moderate";
  if (score <= 60) return "High";
  return "Extreme";
}

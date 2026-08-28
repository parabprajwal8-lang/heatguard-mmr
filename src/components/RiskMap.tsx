import { useState, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from "react-leaflet";
import type { Layer, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

import { wardGeoJSON, coolingShelters, hospitals, type WardProperties } from "@/data/mapData";
import type { WardWeather } from "@/hooks/useWeatherData";
import WardDrawer from "@/components/WardDrawer";
import { useScenario } from "@/context/ScenarioContext";

// ── Risk color scale ────────────────────────────────────────────────────────
function riskColor(score: number) {
  if (score <= 20) return "#10B981";
  if (score <= 40) return "#F59E0B";
  if (score <= 60) return "#F97316";
  if (score <= 80) return "#EF4444";
  return "#8B5CF6";
}

// ── Fly-to helper ───────────────────────────────────────────────────────────
function FlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap();
  if (center) map.flyTo(center, 13, { duration: 0.8 });
  return null;
}

// ── Layer toggles ───────────────────────────────────────────────────────────
interface Layers { wards: boolean; shelters: boolean; hospitals: boolean }

// ── Props ───────────────────────────────────────────────────────────────────
interface RiskMapProps {
  wards: WardWeather[];
  loading: boolean;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function RiskMap({ wards, loading }: RiskMapProps) {
  const { setSelectedWardId } = useScenario();
  const [layers, setLayers] = useState<Layers>({ wards: true, shelters: true, hospitals: true });
  const [selectedWard, setSelectedWard] = useState<WardWeather | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [search, setSearch] = useState("");

  const wardMap = new Map(wards.map((w) => [w.id, w]));

  const toggleLayer = (key: keyof Layers) =>
    setLayers((p) => ({ ...p, [key]: !p[key] }));

  const onWardClick = useCallback(
    (wardId: string) => {
      const w = wardMap.get(wardId);
      if (w) {
        setSelectedWard(w);
        setSelectedWardId(wardId);
        // Get center of ward from WARDS constant
        const feat = wardGeoJSON.features.find((f) => f.properties.id === wardId);
        if (feat) {
          const coords = feat.geometry.coordinates[0];
          const avgLat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
          const avgLon = coords.reduce((s, c) => s + c[0], 0) / coords.length;
          setFlyTarget([avgLat, avgLon]);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wards, setSelectedWardId]
  );

  // Filter wards by search
  const filteredIds = new Set(
    search.trim()
      ? wards
          .filter(
            (w) =>
              w.name.toLowerCase().includes(search.toLowerCase()) ||
              w.id.toLowerCase().includes(search.toLowerCase()) ||
              w.zone.toLowerCase().includes(search.toLowerCase())
          )
          .map((w) => w.id)
      : wards.map((w) => w.id)
  );

  // GeoJSON style per feature
  const wardStyle = (feature: GeoJSON.Feature | undefined) => {
    const id = (feature?.properties as WardProperties | undefined)?.id ?? "";
    const w = wardMap.get(id);
    const score = w?.riskScore ?? 0;
    const isSelected = selectedWard?.id === id;
    const isVisible = filteredIds.has(id);
    return {
      fillColor: riskColor(score),
      fillOpacity: isVisible ? (isSelected ? 0.7 : 0.4) : 0.08,
      color: isSelected ? "#ffffff" : riskColor(score),
      weight: isSelected ? 3 : 1.5,
      opacity: isVisible ? 1 : 0.2,
    };
  };

  // GeoJSON event binding
  const onEachWard = (feature: GeoJSON.Feature, layer: Layer) => {
    const props = feature.properties as WardProperties;
    const w = wardMap.get(props.id);

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle({ weight: 3, fillOpacity: 0.6 });
        if (w) {
          target.bindTooltip(
            `<strong>${w.name}</strong><br/>Risk: ${w.riskScore}/100 · ${w.risk}<br/>WBGT: ${w.heatIndex.toFixed(1)}°C | UTCI: ${w.utci.toFixed(1)}°C`,
            { sticky: true, className: "ward-tooltip" }
          ).openTooltip();
        }
      },
      mouseout: (e: LeafletMouseEvent) => {
        const target = e.target as L.Path;
        const isSelected = selectedWard?.id === props.id;
        target.setStyle({
          weight: isSelected ? 3 : 1.5,
          fillOpacity: isSelected ? 0.7 : 0.4,
        });
        target.closeTooltip();
      },
      click: () => onWardClick(props.id),
    });
  };

  const readinessColor = (r: string) =>
    r === "Ready" ? "text-green-400" : r === "Partial" ? "text-yellow-400" : "text-red-400";

  return (
    <div className="w-full h-full relative flex flex-col">

      {/* ── Controls bar ── */}
      <div className="absolute top-md left-md right-md z-[1000] flex gap-sm flex-wrap items-center">
        {/* Search */}
        <div className="relative flex-grow max-w-xs">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-sm text-outline">search</span>
          <input
            className="w-full pl-8 pr-3 py-1.5 bg-surface-container-lowest/90 backdrop-blur border border-outline-variant rounded-lg text-body-md font-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-level-1 text-sm"
            placeholder="Search ward, ID, or zone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Layer toggles */}
        {(["wards", "shelters", "hospitals"] as const).map((key) => {
          const labels = { wards: "Wards", shelters: "Shelters", hospitals: "Hospitals" };
          const colors = { wards: "bg-primary-container", shelters: "bg-cyan-500", hospitals: "bg-blue-500" };
          return (
            <label
              key={key}
              className="flex items-center gap-xs px-sm py-xs bg-surface-container-lowest/90 backdrop-blur rounded-lg border border-outline-variant shadow-level-1 cursor-pointer text-label-sm font-label-sm text-on-background select-none"
            >
              <input
                type="checkbox"
                checked={layers[key]}
                onChange={() => toggleLayer(key)}
                className="accent-primary w-3 h-3"
              />
              <span className={`w-2 h-2 rounded-full ${colors[key]}`} />
              {labels[key]}
            </label>
          );
        })}
      </div>

      {/* ── Leaflet Map ── */}
      <MapContainer
        center={[19.076, 72.877]}
        zoom={11}
        className="flex-grow z-0"
        style={{ minHeight: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FlyTo center={flyTarget} />

        {/* Ward polygons */}
        {layers.wards && !loading && (
          <GeoJSON
            key={`wards-${selectedWard?.id ?? "none"}-${search}`}
            data={wardGeoJSON}
            style={wardStyle}
            onEachFeature={onEachWard}
          />
        )}

        {/* Cooling shelters */}
        {layers.shelters &&
          coolingShelters.map((s) => (
            <CircleMarker
              key={s.id}
              center={[s.lat, s.lon]}
              radius={7}
              pathOptions={{ color: "#06b6d4", fillColor: "#06b6d4", fillOpacity: 0.8, weight: 2 }}
            >
              <Popup>
                <div className="text-sm font-sans">
                  <strong>{s.name}</strong>
                  <br />Capacity: {s.occupancy}/{s.capacity}
                  <br />Hours: {s.hours}
                  <br />Water: {s.waterAvailable ? "✅ Available" : "❌ Unavailable"}
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Hospitals */}
        {layers.hospitals &&
          hospitals.map((h) => (
            <CircleMarker
              key={h.id}
              center={[h.lat, h.lon]}
              radius={7}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.8, weight: 2 }}
            >
              <Popup>
                <div className="text-sm font-sans">
                  <strong>{h.name}</strong>
                  <br />ICU beds: {h.icuBeds}
                  <br />Heatstroke beds: {h.heatstrokeBeds}
                  <br />Readiness: <span className={readinessColor(h.readiness)}>{h.readiness}</span>
                </div>
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-[500] bg-inverse-surface/60 flex items-center justify-center">
          <div className="bg-surface-container-lowest rounded-xl px-lg py-md shadow-level-2 flex items-center gap-sm">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-label-md font-label-md text-primary">Loading weather data…</span>
          </div>
        </div>
      )}

      {/* Ward detail drawer */}
      <WardDrawer ward={selectedWard} onClose={() => { setSelectedWard(null); setFlyTarget(null); }} />
    </div>
  );
}

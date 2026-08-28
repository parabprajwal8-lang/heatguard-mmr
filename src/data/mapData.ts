import type { FeatureCollection, Polygon } from "geojson";

export interface WardProperties {
  id: string;
  name: string;
  zone: string;
}

// ── Complete GeoJSON for all 24 BMC Wards of Mumbai ─────────────────────────
export const wardGeoJSON: FeatureCollection<Polygon, WardProperties> = {
  type: "FeatureCollection",
  features: [
    // South Zone
    {
      type: "Feature",
      properties: { id: "A", name: "A Ward (Colaba & Fort)", zone: "South" },
      geometry: { type: "Polygon", coordinates: [[[72.805, 18.895], [72.835, 18.895], [72.835, 18.925], [72.815, 18.930], [72.805, 18.895]]] },
    },
    {
      type: "Feature",
      properties: { id: "B", name: "B Ward (Dongri & Masjid)", zone: "South" },
      geometry: { type: "Polygon", coordinates: [[[72.835, 18.935], [72.855, 18.935], [72.855, 18.955], [72.835, 18.955], [72.835, 18.935]]] },
    },
    {
      type: "Feature",
      properties: { id: "C", name: "C Ward (Marine Lines & Kalbadevi)", zone: "South" },
      geometry: { type: "Polygon", coordinates: [[[72.815, 18.935], [72.835, 18.935], [72.835, 18.958], [72.815, 18.958], [72.815, 18.935]]] },
    },
    {
      type: "Feature",
      properties: { id: "D", name: "D Ward (Malabar Hill & Grant Rd)", zone: "South" },
      geometry: { type: "Polygon", coordinates: [[[72.795, 18.945], [72.825, 18.945], [72.825, 18.975], [72.795, 18.975], [72.795, 18.945]]] },
    },
    {
      type: "Feature",
      properties: { id: "E", name: "E Ward (Byculla & Mazgaon)", zone: "South" },
      geometry: { type: "Polygon", coordinates: [[[72.825, 18.960], [72.850, 18.960], [72.850, 18.988], [72.825, 18.988], [72.825, 18.960]]] },
    },

    // Central Zone
    {
      type: "Feature",
      properties: { id: "FS", name: "F South (Parel & Sewri)", zone: "Central" },
      geometry: { type: "Polygon", coordinates: [[[72.830, 18.985], [72.860, 18.985], [72.860, 19.015], [72.830, 19.015], [72.830, 18.985]]] },
    },
    {
      type: "Feature",
      properties: { id: "FN", name: "F North (Sion & Matunga)", zone: "Central" },
      geometry: { type: "Polygon", coordinates: [[[72.845, 19.015], [72.875, 19.015], [72.875, 19.045], [72.845, 19.045], [72.845, 19.015]]] },
    },
    {
      type: "Feature",
      properties: { id: "GS", name: "G South (Worli & Lower Parel)", zone: "Central" },
      geometry: { type: "Polygon", coordinates: [[[72.805, 18.985], [72.835, 18.985], [72.835, 19.020], [72.805, 19.020], [72.805, 18.985]]] },
    },
    {
      type: "Feature",
      properties: { id: "GN", name: "G North (Dharavi & Dadar W)", zone: "Central" },
      geometry: { type: "Polygon", coordinates: [[[72.835, 19.025], [72.868, 19.025], [72.868, 19.055], [72.835, 19.055], [72.835, 19.025]]] },
    },

    // Western Suburbs
    {
      type: "Feature",
      properties: { id: "HW", name: "H West (Bandra W & Khar)", zone: "West" },
      geometry: { type: "Polygon", coordinates: [[[72.815, 19.045], [72.840, 19.045], [72.840, 19.075], [72.815, 19.075], [72.815, 19.045]]] },
    },
    {
      type: "Feature",
      properties: { id: "HE", name: "H East (Bandra E & Santacruz E)", zone: "West" },
      geometry: { type: "Polygon", coordinates: [[[72.840, 19.050], [72.870, 19.050], [72.870, 19.085], [72.840, 19.085], [72.840, 19.050]]] },
    },
    {
      type: "Feature",
      properties: { id: "KW", name: "K West (Andheri W & Juhu)", zone: "West" },
      geometry: { type: "Polygon", coordinates: [[[72.810, 19.090], [72.845, 19.090], [72.845, 19.140], [72.810, 19.140], [72.810, 19.090]]] },
    },
    {
      type: "Feature",
      properties: { id: "KE", name: "K East (Andheri East)", zone: "West" },
      geometry: { type: "Polygon", coordinates: [[[72.845, 19.090], [72.885, 19.090], [72.885, 19.140], [72.845, 19.140], [72.845, 19.090]]] },
    },
    {
      type: "Feature",
      properties: { id: "PS", name: "P South (Goregaon)", zone: "West" },
      geometry: { type: "Polygon", coordinates: [[[72.825, 19.145], [72.870, 19.145], [72.870, 19.175], [72.825, 19.175], [72.825, 19.145]]] },
    },
    {
      type: "Feature",
      properties: { id: "PN", name: "P North (Malad)", zone: "West" },
      geometry: { type: "Polygon", coordinates: [[[72.825, 19.175], [72.875, 19.175], [72.875, 19.205], [72.825, 19.205], [72.825, 19.175]]] },
    },
    {
      type: "Feature",
      properties: { id: "RS", name: "R South (Kandivali)", zone: "West" },
      geometry: { type: "Polygon", coordinates: [[[72.830, 19.205], [72.875, 19.205], [72.875, 19.230], [72.830, 19.230], [72.830, 19.205]]] },
    },
    {
      type: "Feature",
      properties: { id: "RC", name: "R Central (Borivali W)", zone: "West" },
      geometry: { type: "Polygon", coordinates: [[[72.830, 19.230], [72.875, 19.230], [72.875, 19.255], [72.830, 19.255], [72.830, 19.230]]] },
    },
    {
      type: "Feature",
      properties: { id: "RN", name: "R North (Dahisar)", zone: "West" },
      geometry: { type: "Polygon", coordinates: [[[72.835, 19.255], [72.880, 19.255], [72.880, 19.280], [72.835, 19.280], [72.835, 19.255]]] },
    },

    // Eastern Suburbs
    {
      type: "Feature",
      properties: { id: "L", name: "L Ward (Kurla & Sakinaka)", zone: "East" },
      geometry: { type: "Polygon", coordinates: [[[72.865, 19.060], [72.900, 19.060], [72.905, 19.095], [72.865, 19.095], [72.865, 19.060]]] },
    },
    {
      type: "Feature",
      properties: { id: "ME", name: "M East (Govandi & Mankhurd)", zone: "East" },
      geometry: { type: "Polygon", coordinates: [[[72.905, 19.035], [72.945, 19.035], [72.945, 19.070], [72.905, 19.070], [72.905, 19.035]]] },
    },
    {
      type: "Feature",
      properties: { id: "MW", name: "M West (Chembur)", zone: "East" },
      geometry: { type: "Polygon", coordinates: [[[72.880, 19.040], [72.915, 19.040], [72.915, 19.075], [72.880, 19.075], [72.880, 19.040]]] },
    },
    {
      type: "Feature",
      properties: { id: "N", name: "N Ward (Ghatkopar)", zone: "East" },
      geometry: { type: "Polygon", coordinates: [[[72.895, 19.075], [72.930, 19.075], [72.930, 19.110], [72.895, 19.110], [72.895, 19.075]]] },
    },
    {
      type: "Feature",
      properties: { id: "S", name: "S Ward (Bhandup & Powai)", zone: "East" },
      geometry: { type: "Polygon", coordinates: [[[72.895, 19.110], [72.945, 19.110], [72.945, 19.155], [72.895, 19.155], [72.895, 19.110]]] },
    },
    {
      type: "Feature",
      properties: { id: "T", name: "T Ward (Mulund)", zone: "East" },
      geometry: { type: "Polygon", coordinates: [[[72.925, 19.155], [72.970, 19.155], [72.970, 19.195], [72.925, 19.195], [72.925, 19.155]]] },
    },
  ],
};

// ── Cooling Shelters ────────────────────────────────────────────────────────
export interface CoolingShelter {
  id: string;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
  occupancy: number;
  hours: string;
  waterAvailable: boolean;
}

export const coolingShelters: CoolingShelter[] = [
  { id: "CS1", name: "BMC Community Hall — Colaba",   lat: 18.910, lon: 72.815, capacity: 200, occupancy: 85,  hours: "8 AM – 8 PM", waterAvailable: true  },
  { id: "CS2", name: "Girgaon Chowpatty Shelter",     lat: 18.952, lon: 72.816, capacity: 180, occupancy: 95,  hours: "8 AM – 9 PM", waterAvailable: true  },
  { id: "CS3", name: "Byculla Municipal Hall",         lat: 18.975, lon: 72.833, capacity: 220, occupancy: 140, hours: "24 hrs",       waterAvailable: true  },
  { id: "CS4", name: "Dharavi Relief Centre",          lat: 19.043, lon: 72.855, capacity: 350, occupancy: 290, hours: "24 hrs",       waterAvailable: true  },
  { id: "CS5", name: "Worli Seaface Transit Shelter",  lat: 19.008, lon: 72.815, capacity: 160, occupancy: 70,  hours: "8 AM – 8 PM", waterAvailable: true  },
  { id: "CS6", name: "Bandra Reclamation Park Hall",   lat: 19.052, lon: 72.828, capacity: 300, occupancy: 110, hours: "7 AM – 9 PM", waterAvailable: true  },
  { id: "CS7", name: "Kurla Municipal School",         lat: 19.075, lon: 72.882, capacity: 150, occupancy: 60,  hours: "9 AM – 6 PM", waterAvailable: false },
  { id: "CS8", name: "Govandi Public Welfare Shelter", lat: 19.055, lon: 72.922, capacity: 280, occupancy: 210, hours: "24 hrs",       waterAvailable: true  },
  { id: "CS9", name: "Andheri Sports Complex",         lat: 19.118, lon: 72.835, capacity: 500, occupancy: 120, hours: "7 AM – 10 PM",waterAvailable: true  },
  { id: "CS10",name: "Goregaon Aarey Colony Hub",      lat: 19.155, lon: 72.865, capacity: 140, occupancy: 45,  hours: "8 AM – 6 PM", waterAvailable: true  },
  { id: "CS11",name: "Borivali National Park Gate",    lat: 19.230, lon: 72.860, capacity: 100, occupancy: 30,  hours: "6 AM – 6 PM", waterAvailable: true  },
  { id: "CS12",name: "Powai Lake Transit Center",      lat: 19.128, lon: 72.915, capacity: 190, occupancy: 80,  hours: "8 AM – 8 PM", waterAvailable: true  },
];

// ── Hospitals ───────────────────────────────────────────────────────────────
export interface Hospital {
  id: string;
  name: string;
  lat: number;
  lon: number;
  icuBeds: number;
  heatstrokeBeds: number;
  readiness: "Ready" | "Partial" | "Low";
}

export const hospitals: Hospital[] = [
  { id: "H1",  name: "INS Ashvini Hospital (Colaba)",  lat: 18.905, lon: 72.812, icuBeds: 20, heatstrokeBeds: 5,  readiness: "Ready"   },
  { id: "H2",  name: "JJ Hospital (Byculla)",         lat: 18.962, lon: 72.834, icuBeds: 50, heatstrokeBeds: 15, readiness: "Ready"   },
  { id: "H3",  name: "Nair Hospital (Mumbai Central)", lat: 18.972, lon: 72.822, icuBeds: 40, heatstrokeBeds: 10, readiness: "Ready"   },
  { id: "H4",  name: "KEM Hospital (Parel)",           lat: 19.000, lon: 72.842, icuBeds: 45, heatstrokeBeds: 12, readiness: "Ready"   },
  { id: "H5",  name: "Sion Hospital (Sion)",          lat: 19.040, lon: 72.862, icuBeds: 30, heatstrokeBeds: 8,  readiness: "Ready"   },
  { id: "H6",  name: "Bhabha Hospital (Bandra)",       lat: 19.058, lon: 72.835, icuBeds: 25, heatstrokeBeds: 6,  readiness: "Partial" },
  { id: "H7",  name: "Rajawadi Hospital (Ghatkopar)", lat: 19.070, lon: 72.895, icuBeds: 25, heatstrokeBeds: 6,  readiness: "Partial" },
  { id: "H8",  name: "Cooper Hospital (Vile Parle)",   lat: 19.104, lon: 72.838, icuBeds: 35, heatstrokeBeds: 10, readiness: "Ready"   },
  { id: "H9",  name: "SevenHills Hospital (Andheri E)",lat: 19.118, lon: 72.878, icuBeds: 60, heatstrokeBeds: 20, readiness: "Ready"   },
  { id: "H10", name: "Siddharth Hospital (Goregaon)",  lat: 19.162, lon: 72.848, icuBeds: 18, heatstrokeBeds: 4,  readiness: "Partial" },
  { id: "H11", name: "Bhagwati Hospital (Borivali)",   lat: 19.215, lon: 72.852, icuBeds: 20, heatstrokeBeds: 4,  readiness: "Low"     },
  { id: "H12", name: "Fortis Hospital (Mulund)",       lat: 19.168, lon: 72.948, icuBeds: 35, heatstrokeBeds: 8,  readiness: "Ready"   },
];

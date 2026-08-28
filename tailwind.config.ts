import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ─── Colors (from DESIGN.md) ─── */
      colors: {
        surface: "#f7fafc",
        "surface-dim": "#d7dadc",
        "surface-bright": "#f7fafc",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f4f6",
        "surface-container": "#ebeef0",
        "surface-container-high": "#e5e9eb",
        "surface-container-highest": "#e0e3e5",
        "on-surface": "#181c1e",
        "on-surface-variant": "#43474e",
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eef1f3",
        outline: "#74777f",
        "outline-variant": "#c4c6cf",
        "surface-tint": "#455f88",
        "surface-variant": "#e0e3e5",
        primary: "#002045",
        "on-primary": "#ffffff",
        "primary-container": "#1a365d",
        "on-primary-container": "#86a0cd",
        "inverse-primary": "#adc7f7",
        secondary: "#ad3035",
        "on-secondary": "#ffffff",
        "secondary-container": "#fe6c6b",
        "on-secondary-container": "#6d0010",
        tertiary: "#002712",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#003f21",
        "on-tertiary-container": "#3fb371",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "primary-fixed": "#d6e3ff",
        "primary-fixed-dim": "#adc7f7",
        "on-primary-fixed": "#001b3c",
        "on-primary-fixed-variant": "#2d476f",
        "secondary-fixed": "#ffdad8",
        "secondary-fixed-dim": "#ffb3b0",
        "on-secondary-fixed": "#410006",
        "on-secondary-fixed-variant": "#8c1620",
        "tertiary-fixed": "#88f9b0",
        "tertiary-fixed-dim": "#6bdc96",
        "on-tertiary-fixed": "#00210f",
        "on-tertiary-fixed-variant": "#00522c",
        background: "#f7fafc",
        "on-background": "#181c1e",
      },

      /* ─── Border Radius (from DESIGN.md) ─── */
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },

      /* ─── Spacing (from DESIGN.md) ─── */
      spacing: {
        unit: "4px",
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        gutter: "16px",
        "margin-mobile": "16px",
        "margin-desktop": "64px",
        "max-width": "1280px",
      },

      /* ─── Font Family ─── */
      fontFamily: {
        sans: ['"Public Sans"', "system-ui", "sans-serif"],
        "display-lg": ['"Public Sans"'],
        "display-lg-mobile": ['"Public Sans"'],
        "headline-lg": ['"Public Sans"'],
        "headline-lg-mobile": ['"Public Sans"'],
        "headline-md": ['"Public Sans"'],
        "body-lg": ['"Public Sans"'],
        "body-md": ['"Public Sans"'],
        "label-md": ['"Public Sans"'],
        "label-sm": ['"Public Sans"'],
      },

      /* ─── Font Size (with line-height, weight, letter-spacing) ─── */
      fontSize: {
        "display-lg": [
          "48px",
          { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-lg-mobile": [
          "36px",
          { lineHeight: "42px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "40px", fontWeight: "600" },
        ],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", fontWeight: "600" },
        ],
        "headline-md": [
          "20px",
          { lineHeight: "28px", fontWeight: "600" },
        ],
        "body-lg": [
          "18px",
          { lineHeight: "28px", fontWeight: "400" },
        ],
        "body-md": [
          "16px",
          { lineHeight: "24px", fontWeight: "400" },
        ],
        "label-md": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" },
        ],
        "label-sm": [
          "12px",
          { lineHeight: "16px", fontWeight: "500" },
        ],
      },

      /* ─── Box Shadow (from DESIGN.md elevation) ─── */
      boxShadow: {
        "level-1": "0 4px 12px rgba(26, 54, 93, 0.05)",
        "level-2": "0 8px 20px rgba(26, 54, 93, 0.10)",
      },

      /* ─── Max Width ─── */
      maxWidth: {
        "max-width": "1280px",
      },
    },
  },
  plugins: [],
};

export default config;

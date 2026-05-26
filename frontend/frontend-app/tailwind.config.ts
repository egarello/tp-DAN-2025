import type { Config } from "tailwindcss";

// Tailwind v4 usa @theme en CSS. Si este config no se detecta
// automáticamente, agregá `@config "./tailwind.config.ts"` en globals.css.

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surface
        "bd-page": "#0b1423",
        "bd-card": "#162032",
        "bd-card-hover": "#1c2a40",
        "bd-sidebar": "#111e30",
        "bd-input": "#1a2840",
        "bd-overlay": "#0d1928cc",
        "bd-skeleton": "#1e2d42",

        // Brand / Interactive
        "bd-blue-bright": "#4fa3f7",
        "bd-blue-cta": "#1a73e8",
        "bd-blue-cta-hover": "#1557c0",
        "bd-blue-badge": "#1565c0",
        "bd-blue-badge-txt": "#ddeeff",

        // Text
        "bd-primary": "#e8ecf4",
        "bd-secondary": "#8b9bb4",
        "bd-muted": "#4f6080",
        "bd-link": "#4fa3f7",
        "bd-inverse": "#ffffff",

        // Borders
        "bd-subtle": "rgba(255,255,255,0.07)",
        "bd-medium": "rgba(255,255,255,0.13)",
        "bd-border-input": "rgba(255,255,255,0.15)",
        "bd-focus": "#4fa3f7",

        // Semantic
        "bd-deal": "#1b5e35",
        "bd-deal-txt": "#6fcf97",
        "bd-free": "#27ae60",
        "bd-star": "#ffb700",
        "bd-urgency": "#c0392b",
        "bd-promo": "#e67e22",
      },

      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },

      fontSize: {
        "bd-xs": ["0.6875rem", { lineHeight: "1.4" }],
        "bd-sm": ["0.8125rem", { lineHeight: "1.4" }],
        "bd-md": ["0.9375rem", { lineHeight: "1.5" }],
        "bd-lg": ["1.0625rem", { lineHeight: "1.3" }],
        "bd-xl": ["1.25rem", { lineHeight: "1.2" }],
      },

      spacing: {
        "bd-xs": "4px",
        "bd-sm": "8px",
        "bd-md": "12px",
        "bd-lg": "16px",
        "bd-xl": "24px",
        "bd-2xl": "32px",
      },

      borderRadius: {
        "bd-sm": "4px",
        "bd-md": "6px",
        "bd-card": "8px",
        "bd-pill": "20px",
        "bd-full": "9999px",
      },

      boxShadow: {
        "bd-card": "0 2px 8px rgba(0,0,0,0.45)",
        "bd-card-hover": "0 8px 24px rgba(0,0,0,0.65)",
        "bd-cta": "0 4px 12px rgba(26,115,232,0.4)",
      },

      zIndex: {
        "bd-card": "1",
        "bd-badge": "2",
        "bd-tooltip": "10",
        "bd-modal": "100",
      },
    },
  },
};

export default config;

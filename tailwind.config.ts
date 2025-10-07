import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skin: {
          base: "var(--bg)",
          card: "var(--card)",
          text: "var(--text)",
          muted: "var(--muted)",
          primary: "var(--primary)",
          ring: "var(--ring)",
        },
      },
      borderColor: {
        skin: {
          ring: "var(--ring)",
        },
      },
      textColor: {
        skin: {
          base: "var(--text)",
          muted: "var(--muted)",
          primary: "var(--primary)",
        },
      },
      backgroundColor: {
        skin: {
          base: "var(--bg)",
          card: "var(--card)",
          muted: "var(--muted)",
          primary: "var(--primary)",
        },
      },
      boxShadow: {
        md: "0 12px 30px -16px rgb(15 23 42 / 0.2)",
        lg: "0 24px 48px -24px rgb(15 23 42 / 0.32)",
      },
      borderRadius: {
        "2xl": "1.5rem",
      },
      transitionTimingFunction: {
        "ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

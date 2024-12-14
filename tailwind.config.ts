import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#F59E0B",
        danger: "#EF4444",
        success: "#10B981",
        info: "#3B82F6",
        warning: "#F59E0B",
        background: "#F6F6F6",
        black: {
          default: "#000000",
          1:"#6B6B6B"
        }
      },
    },
  },
  plugins: [],
};
export default config;

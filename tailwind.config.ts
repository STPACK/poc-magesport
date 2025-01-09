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
          DEFAULT: "#000000",
          1: "#6B6B6B",
          2: "#303030",
        },
      },
      boxShadow: {
        header: "0 2px 18px 0 rgba(129,162,182,.2)",
      },
    },
  },
  plugins: [],
};
export default config;

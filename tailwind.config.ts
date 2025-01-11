import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: {
          1: "#FFEF2F",
          2: "#C568ED",
          3: "#e60000",
          4: "#00E3FF",
          5: "#FF515D",
          6: "#00C894",
        },
        border: {
          DEFAULT: "#D9D9D9",
        },
        gray: {
          1: "#C4C4C4",
          2: "#9D9D9D",
          3: "#7B7B7B",
          4: "#555555",
        },
        "dark-gray": {
          DEFAULT: "#262626",
        },
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

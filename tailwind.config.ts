import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        bg: "rgba(255, 255, 255, 0.145) 0px 0px 0px 1px, rgba(0, 0, 0, 0.16) 0px 1px 2px 0px",
      },
    },
  },
  safelist: [
    "text-white",
    "text-red-500",
    "text-lime-500",
    "text-yellow-500",
    "text-cyan-500",
    "text-sky-500",
    "text-purple-500",
    "text-red-700",
    "text-pink-600",
  ],
  plugins: [],
} satisfies Config;

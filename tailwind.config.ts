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

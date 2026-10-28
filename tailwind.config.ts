import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0062F5",
          hover: "#0050C7",
          light: "#EFF6FF",
        },
        secondary: {
          DEFAULT: "#0BB07B",
          light: "#E6F7F1",
        },
      },
    },
  },
  plugins: [],
}

export default config

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        purpple: {
          600: "#635fc7",
          400: "#aba4ff",
          200: "#e4ebfa",
          100: "#f4f7fd",
        },
        grayy: {
          900: "#000112",
          800: "#20212c",
          700: "#2b2c37",
          600: "#3e3f4e",
          200: "#828fa3",
        },
        white: {
          0: "#ffffff",
        },
        accent: {
          600: "#ea5555",
          300: "#ff9898",
        },
        circle: {
          1: "#49c4e5 ",
          2: "#8471f2",
          3: "#67e2ae",
        },
      },
    },
  },
  plugins: [],
};
export default config;

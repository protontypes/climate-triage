/* eslint-disable prettier/prettier */
// @ts-check
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      lineHeight: {
        11: "2.75rem",
        12: "3rem",
        13: "3.25rem",
        14: "3.5rem"
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", ...fontFamily.sans]
      },
      colors: {
        primary: {
          DEFAULT: "#e3407c",
          100: "#330817",
          200: "#650f2f",
          300: "#981746",
          400: "#ca1e5d",
          500: "#e3407c",
          600: "#e86696",
          700: "#ee8db0",
          800: "#f4b3ca",
          900: "#f9d9e5"
        },
        pink: {
          DEFAULT: "#e3407c",
          100: "#330817",
          200: "#650f2f",
          300: "#981746",
          400: "#ca1e5d",
          500: "#e3407c",
          600: "#e86696",
          700: "#ee8db0",
          800: "#f4b3ca",
          900: "#f9d9e5"
        },
        purple: {
          DEFAULT: "#851eeb",
          100: "#1b0431",
          200: "#350862",
          300: "#500d92",
          400: "#6a11c3",
          500: "#851eeb",
          600: "#9d4bef",
          700: "#b678f3",
          800: "#cea5f7",
          900: "#e7d2fb"
        },
        blue: {
          DEFAULT: "#1c6cf7",
          100: "#021535",
          200: "#04296a",
          300: "#063e9f",
          400: "#0853d5",
          500: "#1c6cf7",
          600: "#4a8af8",
          700: "#77a7fa",
          800: "#a4c4fc",
          900: "#d2e2fd"
        },
        azure: {
          DEFAULT: "#61d0ff",
          100: "#003146",
          200: "#00638d",
          300: "#0094d3",
          400: "#1bbaff",
          500: "#61d0ff",
          600: "#81d9ff",
          700: "#a0e3ff",
          800: "#c0ecff",
          900: "#dff6ff"
        },
        cyan: {
          DEFAULT: "#47e9f5",
          100: "#03383c",
          200: "#067178",
          300: "#09a9b4",
          400: "#0de1f0",
          500: "#47e9f5",
          600: "#6ceef7",
          700: "#91f2f9",
          800: "#b5f6fb",
          900: "#dafbfd"
        },
        green: {
          DEFAULT: "#47f6ad",
          100: "#033c24",
          200: "#067949",
          300: "#09b56d",
          400: "#0bf292",
          500: "#47f6ad",
          600: "#6bf8bd",
          700: "#90face",
          800: "#b5fcde",
          900: "#dafdef"
        },
        yellow: {
          DEFAULT: "#ffec70",
          100: "#494000",
          200: "#937f00",
          300: "#dcbf00",
          400: "#ffe227",
          500: "#ffec70",
          600: "#fff08d",
          700: "#fff4a9",
          800: "#fff7c6",
          900: "#fffbe2"
        },
        red: {
          DEFAULT: "#fa4d52",
          100: "#400204",
          200: "#7f0307",
          300: "#bf050b",
          400: "#f90c14",
          500: "#fa4d52",
          600: "#fb7074",
          700: "#fc9497",
          800: "#fdb7ba",
          900: "#fedbdc"
        },
        black: {
          DEFAULT: "#101620",
          100: "#030406",
          200: "#06080c",
          300: "#090d12",
          400: "#0c1118",
          500: "#101620",
          600: "#2e3f5c",
          700: "#4e6a9a",
          800: "#849ac1",
          900: "#c1cde0"
        },
        gray: {
          DEFAULT: "#787a82",
          100: "#18181a",
          200: "#303134",
          300: "#48494e",
          400: "#606268",
          500: "#787a82",
          600: "#93949b",
          700: "#aeafb4",
          800: "#c9cacd",
          900: "#e4e4e6"
        },
        silver: {
          DEFAULT: "#e6edf3",
          100: "#1f3140",
          200: "#3e6180",
          300: "#6791b6",
          400: "#a7bfd5",
          500: "#e6edf3",
          600: "#ecf1f6",
          700: "#f1f5f8",
          800: "#f5f8fa",
          900: "#fafcfd"
        },
        white: {
          DEFAULT: "#ffffff",
          100: "#333333",
          200: "#666666",
          300: "#999999",
          400: "#cccccc",
          500: "#ffffff",
          600: "#ffffff",
          700: "#ffffff",
          800: "#ffffff",
          900: "#ffffff"
        }
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            p: {
              color: theme("colors.gray.800"),
            },
            ul: {
              color: theme("colors.gray.800"),
            },
            strong: {
              color: theme("colors.green.500"),
            },
            a: {
              color: theme("colors.primary.500"),
              "&:hover": {
                color: `${theme("colors.primary.400")}`
              },
              code: { color: theme("colors.primary.400") }
            },
            "h1,h2,h3,h4,h5,h6": {
              color: theme("colors.gray.900")
            },
            "h1,h2": {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight")
            },
            h3: {
              fontWeight: "600"
            },
            code: {
              color: theme("colors.azure.600")
            }
          }
        },
      })
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
};

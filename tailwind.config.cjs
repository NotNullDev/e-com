/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#67e8f9",

          secondary: "#7c3aed",

          accent: "#a3e635",

          neutral: "#414558",

          "base-100": "#272935",

          info: "#8BE8FD",

          success: "#52FA7C",

          warning: "#F1FA89",

          error: "#FF5757",
        },
      },
    ],
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
};

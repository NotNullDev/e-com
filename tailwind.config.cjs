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
          primary: "#d1d5db",
          secondary: "#828df8",
          accent: "#f471b5",
          neutral: "#1d283a",
          "base-100": "#0f1729",
          info: "#0ca6e9",
          success: "#2bd4bd",
          warning: "#f4c152",
          error: "#fb6f84",
        },
      },
      "light",
    ],
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

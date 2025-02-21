/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        pinks: "#fc1e65",
      },
      fontFamily: {
        poppins: ["Poppins", "san-serif"],
      },
    },
    screens: {
      xs: "350px",
      sm: "480px",
      ssm: "550px",
      md: "768px",
      lg: "976px",
      llg: "1250px",
      xl: "1440px",
      xll: "1669px",
    },
  },
  plugins: [],
};

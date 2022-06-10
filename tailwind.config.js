module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: "#021C3B",
        night: "#030F25",
      },
    },
  },

  plugins: [require("tailwind-children")],
};

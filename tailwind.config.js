module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: "#1D374E",
      },
    },
  },

  plugins: [require("tailwind-children")],
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: "#1D374E",
        paper: "#F6F6F6",
      },
    },
  },

  plugins: [require("tailwind-children")],
};

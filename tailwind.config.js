module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: "#278fcc",
      },
    },
  },

  plugins: [require("tailwind-children")],
};

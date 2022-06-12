module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: "#0e5dae",
      },
    },
  },

  plugins: [require("tailwind-children")],
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: "#203E55",
      },
    },
  },

  plugins: [require("tailwind-children")],
};

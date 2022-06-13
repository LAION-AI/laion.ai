module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: "#219be0",
      },
    },
  },

  plugins: [require("tailwind-children")],
};

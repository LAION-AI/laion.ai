module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: "rgb(13, 103, 193)",
      },
    },
  },

  plugins: [require("tailwind-children")],
};

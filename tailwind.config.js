module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Montserrat, Roboto"],
      serif: ["Roboto Serif"],
      mono: ["Source Code Pro"],
    },
    extend: {
      animation: {
        bounce200: "bounce 1s infinite 200ms",
        bounce400: "bounce 1s infinite 400ms",
      },
      zIndex: {
        "-1": "-1",
      },
      transformOrigin: {
        0: "0%",
      },
    },
  },
  variants: {
    borderColor: ["responsive", "hover", "focus", "focus-within"],
  },
};

const config = {
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up-loader": {
          "0%": { opacity: "0", transform: "translateY(50px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": {
            transform: "scaleY(0)",
            opacity: "0",
          },
          "50%": {
            transform: "scaleY(0)",
            opacity: "0.5",
          },
          "100%": {
            transform: "scaleY(1)",
            opacity: "1",
          },
        },
        "dropdown-open": {
          "0%": { opacity: "0", transform: "translateY(-4px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "dropdown-close": {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-4px) scale(0.95)" },
        },
      },
      animation: {
        "slide-down": "slide-down 0.4s ease-in-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "fade-in-up-loader": "fade-in-up-loader 0.6s ease-in-out",
        "dropdown-open": "dropdown-open 0.2s ease-out forwards",
      },
    }
  },
  plugins: []
};
export default config;
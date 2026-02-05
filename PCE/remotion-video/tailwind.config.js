module.exports = {
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                pce: {
                    primary: "#723233",
                    secondary: "#B9AFB0",
                    text: "#FFFFFF",
                },
                burgundy: {
                    light: "#723233",
                    DEFAULT: "#5E2C2C",
                    dark: "#4A2222",
                },
                gold: "#FFD700",
            },
            fontFamily: {
                cinzel: ["Cinzel", "serif"],
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
};

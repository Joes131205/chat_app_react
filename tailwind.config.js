/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                nunito_sans: ["Nunito Sans", "san-serif"],
            },
        },
    },
    plugins: [],
};

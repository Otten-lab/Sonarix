/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                purple: {
                    600: '#7E57C2',
                    700: '#6D4CAB',
                },
            },
        },
    },
    plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cream': '#FDFCF0',
                'pastel-pink': '#FFB7CE',
                'pastel-mint': '#B2FBDA',
                'pastel-blue': '#AEE2FF',
                'pastel-yellow': '#FFF9B0',
            },
            boxShadow: {
                'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
                'brutal-hover': '2px 2px 0px 0px rgba(0,0,0,1)',
            },
            borderRadius: {
                'neo': '12px',
            }
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-mulish)', 'Arial', 'sans-serif'],
				display: ['var(--font-audiowide)', 'var(--font-mulish)', 'Arial', 'sans-serif'],
			},
			fontSize: {
				'6xx': ['64px', '130%'],
			},
		},
	},
	plugins: [],
};

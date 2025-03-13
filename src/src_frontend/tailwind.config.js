/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'], // Enable dark mode with class strategy
	content: [
	  './app/**/*.{js,ts,jsx,tsx,mdx}',
	  './pages/**/*.{js,ts,jsx,tsx,mdx}',
	  './components/**/*.{js,ts,jsx,tsx,mdx}',
	  './node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}', // Ensure ShadCN UI is installed and the path is correct
	  './lib/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
	  colors: {
		transparent: 'transparent',
		current: 'currentColor',
		white: '#ffffff',
		black: '#000000',
		brand: '#0075FF',
		lightblue: '#DAEBFF',
		lightgrey: '#AEC7E4',
		navyblue: '#002834',
		beach: '#8EA9C1',
		circlebg: 'rgba(77, 213, 143, 0.25)', // Background color with opacity
		darkblue: '#000321',
		offwhite: 'rgba(255, 255, 255, 0.75)', // Off-white with transparency
		bordertop: 'rgba(196, 196, 196, 0.5)', // Border color with opacity
		background: '#ffffff',
		red: '#F72C5B', // Custom red
		link:'#2160FF',
		primary: {
		  links: '#FC6600', // Coral color for links
		  DEFAULT: '#FC6600', // Default primary color
		  light: '#FF984D33', //
		},
		secondary: {
		  50: '#FFFFFF', // Lightest shade of secondary color
		},
		accent: {
		  orange: '#FFA500', // Bright orange
		  yellow: '#FFD700', // Golden yellow
		  red: '#FF0000', // Bright red
		  border: '#F5F5F5', // Light gray border
		},
		neutral: {
		  light: '#F1F1F1', // Light neutral color (for backgrounds)
		  DEFAULT: '#D1D5DB', // Default neutral color
		  dark: '#333333', // Dark neutral color (for text)
		},
		notification: {
		  success: '#28A745', // Green for success
		  warning: '#FFCD00', // Yellow for warning
		  error: '#DC3545', // Red for error
		  info: '#17A2B8', // Blue for informational messages
		},
		ui: {
		  button: {
			DEFAULT: '#3B82F6', // Blue button color
			hover: '#2563EB', // Darker blue on hover
			active: '#1D4ED8', // Even darker blue when active
		  },
		  text: {
			light: '#636363', // Light text color
			dark: '#152046', // Dark text color
		  },
		},
		green: '#1DB954', // Spotify green
		gray: {
		  light: '#f7fafc', // Light gray
		  DEFAULT: '#a0aec0', // Default gray
		  dark: '#4a5568', // Dark gray
		  300: '#D1D5DB', // Gray 300 (for borders, etc.)
		},
		blue: {
		  light: '#bee3f8', // Light blue
		  DEFAULT: '#4299e1', // Default blue
		  dark: '#2b6cb0', // Dark blue
		},
	  },
	  fontSize: {
		xs: ['0.75rem', { lineHeight: '1rem' }],
		sm: ['0.875rem', { lineHeight: '1.25rem' }],
		base: ['1rem', { lineHeight: '1.5rem' }],
		lg: ['1.125rem', { lineHeight: '1.75rem' }],
		xl: ['1.25rem', { lineHeight: '1.75rem' }],
		'2xl': ['1.5rem', { lineHeight: '2rem' }],
		'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
		'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
		'5xl': ['3rem', { lineHeight: '1' }],
		'6xl': ['3.75rem', { lineHeight: '1' }],
		'7xl': ['4.5rem', { lineHeight: '1' }],
		'8xl': ['6rem', { lineHeight: '1' }],
		'9xl': ['8rem', { lineHeight: '1' }],
		'65xl': ['65px', { lineHeight: '1' }],
		'80xl': ['80px', { lineHeight: '6rem' }],
	  },
	  extend: {
		borderRadius: {
		  lg: 'var(--radius)',
		  md: 'calc(var(--radius) - 2px)',
		  sm: 'calc(var(--radius) - 4px)',
		},
		boxShadow: {
			'custom': '0 0px 4px rgba(0, 0, 0, 0.25)', // Define custom shadow
			'about_us': '0 0 8px rgba(252, 102, 0, 1)', // Define custom shadow
			'rating': '0 4px 60px rgba(21, 32, 70, 0.15)', // Define custom shadow
			'our_story': '0 10px 8px rgba(252, 102, 0, 1)', // Define custom shadow
			'soft': '0 5px 15px rgba(0, 0, 0, 0.1)', // Softer shadow
		  },
		keyframes: {
			"accordion-down": {
			  from: { height: "0" },
			  to: { height: "var(--radix-accordion-content-height)" },
			},
			"accordion-up": {
			  from: { height: "var(--radix-accordion-content-height)" },
			  to: { height: "0" },
			},
		  },
		  animation: {
			"accordion-down": "accordion-down 0.2s ease-out",
			"accordion-up": "accordion-up 0.2s ease-out",
		  },
		
	  },
	},
	plugins: [require('tailwindcss-animate')],
  }
  
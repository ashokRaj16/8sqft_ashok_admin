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
    		lightgrey2: '#F6F6F6',
    		navyblue: '#002834',
    		beach: '#8EA9C1',
    		circlebg: 'rgba(77, 213, 143, 0.25)',
    		darkblue: '#000321',
    		offwhite: 'rgba(255, 255, 255, 0.75)',
    		bordertop: 'rgba(196, 196, 196, 0.5)',
    		background: '#ffffff',
    		red: '#F72C5B',
    		link: '#2160FF',
    		primary: {
    			links: '#FC6600',
    			DEFAULT: '#FC6600',
    			light: '#FF984D33',
    			black: '#222222'
    		},
    		secondary: {
    			'50': '#FFFFFF'
    		},
    		accent: {
    			orange: '#FFA500',
    			yellow: '#FFD700',
    			red: '#FF0000',
    			border: '#F5F5F5'
    		},
    		neutral: {
    			light: '#F1F1F1',
    			DEFAULT: '#D1D5DB',
    			dark: '#333333'
    		},
    		notification: {
    			success: '#28A745',
    			warning: '#FFCD00',
    			error: '#DC3545',
    			info: '#17A2B8'
    		},
    		ui: {
    			button: {
    				DEFAULT: '#3B82F6',
    				hover: '#2563EB',
    				active: '#1D4ED8'
    			},
    			text: {
    				light: '#636363',
    				dark: '#152046'
    			}
    		},
    		green: '#1DB954',
    		gray: {
    			'300': '#D1D5DB',
    			light: '#f7fafc',
    			DEFAULT: '#a0aec0',
    			dark: '#4a5568'
    		},
    		blue: {
    			light: '#bee3f8',
    			DEFAULT: '#4299e1',
    			dark: '#2b6cb0'
    		}
    	},
    	fontSize: {
    		xs: [
    			'0.75rem',
    			{
    				lineHeight: '1rem'
    			}
    		],
    		sm: [
    			'0.875rem',
    			{
    				lineHeight: '1.25rem'
    			}
    		],
    		base: [
    			'1rem',
    			{
    				lineHeight: '1.5rem'
    			}
    		],
    		lg: [
    			'1.125rem',
    			{
    				lineHeight: '1.75rem'
    			}
    		],
    		xl: [
    			'1.25rem',
    			{
    				lineHeight: '1.75rem'
    			}
    		],
    		'2xl': [
    			'1.5rem',
    			{
    				lineHeight: '2rem'
    			}
    		],
    		'3xl': [
    			'1.875rem',
    			{
    				lineHeight: '2.25rem'
    			}
    		],
    		'4xl': [
    			'2.25rem',
    			{
    				lineHeight: '2.5rem'
    			}
    		],
    		'5xl': [
    			'3rem',
    			{
    				lineHeight: '1'
    			}
    		],
    		'6xl': [
    			'3.75rem',
    			{
    				lineHeight: '1'
    			}
    		],
    		'7xl': [
    			'4.5rem',
    			{
    				lineHeight: '1'
    			}
    		],
    		'8xl': [
    			'6rem',
    			{
    				lineHeight: '1'
    			}
    		],
    		'9xl': [
    			'8rem',
    			{
    				lineHeight: '1'
    			}
    		],
    		'65xl': [
    			'65px',
    			{
    				lineHeight: '1'
    			}
    		],
    		'80xl': [
    			'80px',
    			{
    				lineHeight: '6rem'
    			}
    		]
    	},
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		boxShadow: {
    			custom: '0 0px 4px rgba(0, 0, 0, 0.25)',
    			about_us: '0 0 8px rgba(252, 102, 0, 1)',
    			rating: '0 4px 60px rgba(21, 32, 70, 0.15)',
    			our_story: '0 10px 8px rgba(252, 102, 0, 1)',
    			'our-story-counter-left': '-7px 7px 8px rgb(0 0 0 / 25%)',
    			'our-story-counter-right': '7px 7px 8px rgb(0 0 0 / 25%)',
    			'our-story-primary': '0px 0px 4px 4px rgba(252, 102, 0, 1)',
    			soft: '0 5px 15px rgba(0, 0, 0, 0.1)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
	plugins: [require('tailwindcss-animate')],
  }
  
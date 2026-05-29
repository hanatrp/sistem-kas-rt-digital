import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#002045',
                    container: '#1A365D',
                },
                secondary: {
                    DEFAULT: '#29695b',
                    container: '#acedda',
                },
                tertiary: {
                    DEFAULT: '#321b00',
                    container: '#4f2e00',
                },
                surface: {
                    DEFAULT: '#f9f9ff',
                    dim: '#d0daf0',
                    bright: '#f9f9ff',
                    lowest: '#ffffff',
                    low: '#f0f3ff',
                    container: '#e7eeff',
                    high: '#dee8ff',
                    highest: '#d9e3f9',
                    variant: '#d9e3f9',
                },
                neutral: {
                    dark: '#121c2c',
                    text: '#43474e',
                },
                status: {
                    success: '#48BB78',
                    warning: '#DD6B20',
                    error: '#ba1a1a',
                    errorContainer: '#ffdad6',
                    onErrorContainer: '#93000a',
                }
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            borderRadius: {
                'md-custom': '12px',
                'lg-custom': '16px',
                'xl-custom': '24px',
            }
        },
    },

    plugins: [forms],
};

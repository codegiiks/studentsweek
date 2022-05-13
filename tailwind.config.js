const colors = require('tailwindcss/colors');

const defaultFontFamily = {
    sans: [
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'Noto Sans',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
    ],
    serif: [
        'ui-serif',
        'Georgia',
        'Cambria',
        'Times New Roman',
        'Times',
        'serif',
    ],
    mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
    ],
};

module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './layouts/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
        colors: {
            ...colors,
            laurel: {
                DEFAULT: '#069E00',
                50: '#5DFF57',
                100: '#49FF42',
                200: '#22FF19',
                300: '#09F000',
                400: '#08C700',
                500: '#069E00',
                600: '#046600',
                700: '#022E00',
                800: '#000000',
                900: '#000000',
            },
        },
        fontFamily: {
            sans: ['Nunito', ...defaultFontFamily['sans']],
            serif: [...defaultFontFamily['serif']],
            mono: [...defaultFontFamily['mono']],
        },
    },
    plugins: [],
};

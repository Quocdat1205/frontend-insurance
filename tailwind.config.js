// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors')

const commonColors = {
    red: {
        red: '#EB2B3E',
        1: '#FFBDC4',
        2: '#F86876',
        3: '#F01329',
        4: '#CE0014',
    },
    green: {
        green: '#02FCB9',
        1: '#C2FEEE',
        2: '#86FEDE',
        3: '#49F5CD',
        4: '#02CA95',
    },
    blue: {
        blue: '#00ABF9',
        1: '#D6F2FF',
        2: '#99DFFF',
        3: '#5CCBFF',
        4: '#0070A3',
        5: '#3960E6',
    },
    violet: {
        violet: '#5C17FF',
        1: '#D4C2FF',
        2: '#9568FF',
        3: '#6B2CFF',
        4: '#3A00C5',
    },
    orange: {
        orange: '#FFA721',
        1: '#FFCE83',
        2: '#FFC265',
        3: '#FFB544',
        4: '#E98C00',
    },
    yellow: {
        yellow: '#F5ED5D',
        1: '#FFFA9E',
        2: '#FFF98C',
        3: '#F8F068',
        4: '#E8DF3F',
        5: '#FBCD2D',
    },
    white: {
        white: colors.white,
        2: '#F8F8F8',
        3: '#F2F3F4',
    },
    pink: {
        pink: '#FFF1F2',
        1: '#FFF5F6',
        2: '#FFF4F6',
    },
    gray: {
        gray: '#B2B7BC',
        1: '#F2F3F5',
    },
    bgModal: '#3d4252',
    disabled: '#E5E7E8',
}

module.exports = {
    content: ['./src/pages/**/**/*.{js,ts,jsx,tsx}', './src/components/**/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        fontWeight: {
            thin: 100,
            extralight: 200,
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
            black: 900,
        },
        fontFamily: {
            SVN: ['SVN-Outfit'],
            Manrope: ['Manrope'],
        },
        fontSize: {
            xxs: [
                '.625rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '1rem',
                },
            ], // Outline 10px
            xs: [
                '.75rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '1rem',
                },
            ], // Caption 12px
            sm: [
                '.875rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '1.25rem',
                },
            ], // Small text 14px
            tiny: [
                '.875rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '1.3125rem',
                },
            ], // 14px
            base: [
                '1rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '1.5rem',
                },
            ], // 16px
            lg: [
                '1.125rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '1.75rem',
                },
            ], // Body 2 18px
            xl: [
                '1.25rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '1.75rem',
                },
            ], // Body 1, Heading 6 2px
            '2xl': [
                '1.5rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '2rem',
                },
            ], // Heading 5 24px
            '3xl': [
                '1.75rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '2.5rem',
                },
            ], // Heading 4 28px
            '4xl': [
                '2rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '2.75rem',
                },
            ], // Heading 3 32px,
            '5xl': [
                '2.25rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '3.25rem',
                },
            ], //  36
            '6xl': [
                '2.5rem',
                {
                    letterSpacing: '0.5px',
                    lineHeight: '3.25rem',
                },
            ], //  40px
        },
        // TODO split text, background
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            txtPrimary: '#22313F',
            txtSecondary: '#808890',
            redPrimary: '#EB2B3E',
            btnOutline: '#FFF4F5',
            shadow: '#3D4251',
            hover: '#F7F8FA',
            error: '#E5544B',
            success: '#52CC74',
            skeleton: '#F0F0F1',
            bgModal: commonColors.bgModal,
            disabled: commonColors.disabled,
            red: {
                DEFAULT: commonColors.red.red,
                ...commonColors.red,
            },
            green: {
                DEFAULT: commonColors.green.green,
                ...commonColors.green,
            },
            blue: {
                DEFAULT: commonColors.blue.blue,
                ...commonColors.blue,
            },
            violet: {
                DEFAULT: commonColors.violet.violet,
                ...commonColors.violet,
            },
            orange: {
                DEFAULT: commonColors.orange.orange,
                ...commonColors.orange,
            },
            yellow: {
                DEFAULT: commonColors.yellow.yellow,
                ...commonColors.yellow,
            },
            white: {
                DEFAULT: commonColors.white.white,
                ...commonColors.white,
            },
            pink: {
                DEFAULT: commonColors.pink.pink,
                ...commonColors.pink,
            },
            gray: {
                DEFAULT: commonColors.gray.gray,
                ...commonColors.gray,
            },
            divider: {
                DEFAULT: '#E5E7E8',
            },
        },
        extend: {
            flex: {
                1: '1 auto',
            },
            screens: {
                // !TODO ordering must be from small to large because of the min-width
                // refer: https://tailwindcss.com/docs/screens#adding-smaller-breakpoints
                xs: '319px',
                tiny: '355px',
                mobileMedium: '374px',
                '1xs': '391px',
                mobileMiddle: '389px', // match 12 pro
                mobileLarge: '424px',
                tablet: '767px',
                mb: '820px',
                homeNav: '1023px',
                laptopMedium: '1439px',
                insurance: '1280px',
                layout: '1360px',
                '3xl': '1600px',
                '4xl': '1920px',
                iPadPro: { raw: '(width: 1024px) and (height: 1366px)' },
            },
            spacing: {
                128: '32rem',
                144: '36rem',
            },
            borderColor: ['group-focus'],
            dropShadow: {},
            boxShadow: {
                banner: '0px -4px 10px rgba(235, 43, 62, 0.1)',
                card: '0px 6px 18px rgba(9, 30, 66, 0.05)',
                subMenu: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)',
                dropdown: '0px 3px 5px rgba(9, 30, 66, 0.15), 0px 0px 1px rgba(9, 30, 66, 0.31)',
                toast: '0px 8px 5px rgba(23, 43, 77, 0.04), 0px 15px 12px rgba(23, 43, 77, 0.08)',
                table: '0px 2px 10px rgba(9, 30, 66, 0.1)'
            },
            cursor: {
                grabbing: 'grabbing',
            },
            backgroundImage: {
                gradient: 'linear-gradient(88.09deg, #ce0014 0.48%, #e92828 52.94%, #ff5f6d 114.93%)',
            },
        },
    },
    variants: {
        extend: {
            backgroundColor: ['checked'],
            borderColor: ['checked'],
            display: ['group-hover'],
            visibility: ['group-hover'],
            cursor: ['grabbing'],
        },
    },
    plugins: [require('tailwindcss-border-gradient-radius'), require('@tailwindcss/line-clamp')],
}

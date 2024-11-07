module.exports = {
  mode: 'jit',
  content: ['./index.html', './app/**/*.tsx', './app/**/*.ts'],
  theme: {
    minWidth: {
      '40': '10rem',
      '60': '15rem',
      '80': '20rem',
      '100': '25rem',
    },
    maxWidth: {
      '120': '30rem',
      '160': '40rem',
      '200': '50rem',
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes").light,
          primary: "#009688",
          secondary: "#DF9D24",
          "--chkfg": "white",
        }
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes").dark,
          primary: "#02796B",
          secondary: "#BF7C00",
        }
      },
      {
        valentine: {
          ...require("daisyui/src/theming/themes").valentine,
          "base-100": "#fffdfe",
        }
      },
      {
        verypink: {
          ...require("daisyui/src/theming/themes").valentine,
          "primary": "#967ee6",
          "secondary": "#7c44c9",
          "base-100": "#ff44c9",
          "base-content": "#ffffff"
        }
      },

      {
        retro: {
          ...require("daisyui/src/theming/themes").retro,
          primary: "#A76D60",
          secondary: "#808A9F",
        }
      },
      {
        nord: {
          ...require("daisyui/src/theming/themes").nord,
        }
      },
      {
        thursday: {
          ...require("daisyui/src/theming/themes").autumn,
        }
      },
      {
        coffee: {
          ...require("daisyui/src/theming/themes").coffee,
        }
      }
    ],
  }
}

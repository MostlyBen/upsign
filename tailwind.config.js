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
          "--present": "#059669",
          "--tardy": "#B48908",
          "--absent": "#CB1A41"
        }
      },

      {
        dark: {
          ...require("daisyui/src/theming/themes").dark,
          primary: "#02796B",
          secondary: "#BF7C00",
          "--present": "#128762",
          "--tardy": "#AB830D",
          "--absent": "#AD2946"
        }
      },

      {
        nocturne: {
          "primary": "#7d5da3",
          "secondary": "#ea9a97",
          "accent": "#c4a7e7",
          "base-100": "#232136",
          "--present": "#5497a3",
          "--tardy": "#d5a158",
          "--absent": "#c63e64",
        },
      },

      {
        nord: {
          ...require("daisyui/src/theming/themes").nord,
          "--present": "#519872",
          "--tardy": "#B7A200",
          "--absent": "#912F40"
        }
      },

      {
        retro: {
          ...require("daisyui/src/theming/themes").retro,
          primary: "#A76D60",
          secondary: "#808A9F",
          "--present": "#3A7D44",
          "--tardy": "#DEA92F",
          "--absent": "#B03355"
        }
      },

      {
        thursday: {
          ...require("daisyui/src/theming/themes").autumn,
          "--present": "#157A6E",
          "--tardy": "#9B7E46",
          "--absent": "#8A0226"
        }
      },

      {
        valentine: {
          ...require("daisyui/src/theming/themes").valentine,
          "base-100": "#fffdfe",
          "--present": "#63A088",
          "--tardy": "#B9B31B",
          "--absent": "#881600"
        }
      },

      {
        verypink: {
          ...require("daisyui/src/theming/themes").valentine,
          "primary": "#967ee6",
          "secondary": "#7c44c9",
          "base-100": "#ff44c9",
          "base-content": "#ffffff",
          "--present": "#7B44C9",
          "--tardy": "#922613",
          "--absent": "#4D0F0F"
        }
      },
      
      {
        sapphireDark: {
          ...require("daisyui/src/theming/themes").night,
          "--present": "#3EB2FF",
          "--tardy": "#ab830d",
          "--absent": "#BC0000"
        }
      },
    ],
  }
}

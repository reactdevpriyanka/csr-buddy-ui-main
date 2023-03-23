import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';

const utils = {
  row: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  col: {
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nospace: {
    margin: '0',
    padding: '0',
  },
  figure: {
    width: '100%',
    height: 'auto',
    '& > svg': {
      width: '100%',
      height: 'auto',
    },
  },
  lightShadow: {
    boxShadow: '-1px 0px 3px rgba(153, 153, 153, 0.3), 1px 2px 3px rgba(153, 153, 153, 0.3)',
  },
  heavyShadow: {
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.16)',
  },
  srOnly: {
    height: 0,
    display: 'inline-block',
    textIndent: '-9999px',
  },
  fillCurrent: {
    fill: 'currentColor',
  },
  strokeCurrent: {
    stroke: 'currentColor',
  },
  title: {
    fontSize: '1rem',
    color: '#333333',
    fontWeight: '500',
    marginBottom: '0.3rem',
  },
  label: {
    fontSize: '0.875rem',
    color: '#666666',
    marginBottom: '0.3rem',
  },
  subLabel: {
    fontSize: '0.75rem',
    color: '#666666',
    marginBottom: '0.3rem',
    fontStyle: 'italic',
  },
  checkBox: {
    '& .MuiCheckbox-root': {
      borderRadius: '0.25rem',
      marginBottom: '0.125rem',
      marginTop: '0.125rem',
    },
    '& .MuiCheckbox-colorPrimary.Mui-checked': {
      color: '#1C49C2',
    },
  },
  disabled: {
    cursor: 'not-allowed',
    pointerEvents: 'none',
    opacity: 0.6,
  },
  customerSidebarSubpanel: {
    // viewport height minus customer sidebar header height:
    height: 'calc(100vh - 150px)',
  },
  constants: {
    // width for both customerSidebar and rightModal areas:
    sideContentWidth: '464px',
    customerContentWidth: '360px',
  },
  simpleTable: {
    width: '100%',
    minWidth: '350px',
    borderCollapse: 'collapse',
    tableLayout: 'auto',
    textAlign: 'left',
    '& th, td': {
      border: '1px solid #CCCCCC',
      padding: '8px',
      color: 'black',
      fontSize: '14px',
    },
    '& thead th': {
      backgroundColor: '#EEEEEE',
    },
    '& tbody tr:nth-child(even)': {
      backgroundColor: '#FAFAFA',
    },
  },
};

const fonts = {
  size: {
    '2xs': '0.625rem', // 10px
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
  },
  h1: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1.5rem',
    fontWeight: '500',
    letterSpacing: '0.016rem',
    lineHeight: '1.75rem',
  },
  h2: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1.5rem',
    fontWeight: '400',
    letterSpacing: '0.009rem',
    lineHeight: '1.5rem',
  },
  h3: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1.25rem',
    fontWeight: '500',
    letterSpacing: '0.016rem',
    lineHeight: '1.75rem',
  },
  h4: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.875rem',
    fontWeight: '500',
    letterSpacing: '0.15px',
    lineHeight: '1.375rem',
  },
  body: {
    light: {
      /** So Quiet */
    },
    normal: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.125rem',
      color: '#000000',
    },
    medium: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '0.875rem',
      fontWeight: '500',
      lineHeight: '1.125rem',
    },
    bold: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '1rem',
      fontWeight: '700',
      lineHeight: '1.375rem',
    },
    heavy: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '1rem',
      fontWeight: '900',
      lineHeight: '1.375rem',
    },
  },
  textSmall: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.75rem',
    letterSpacing: '0.15px',
    lineHeight: '0.875rem',
  },
  bodyBold: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.6875rem',
    fontWeight: '600',
    lineHeight: '0.9375rem',
  },
};

const borders = {
  none: '0',
  active: '0.125rem solid #163977',
  default: '0.0625rem solid #ccc',
  light: '0.0625rem solid #e8e8e8',
  lightSm: '1px solid #f5f5f5',
};

/** @TODO : Continue fleshng out. Consider area of [100,200,300,...] if larger scales needed */
const blueLegacy = {
  pastel: '#DBEBF9',
  light: '#128CED',
  medium: '#2661CE',
  dark: '#031657',
  baby: '#A3CEF9',
  skyBlue: '#00BFFF',
};

const redLegacy = {
  pastel: '#FDE4E8',
  light: '',
  medium: '#B32605',
  dark: '#851940',
};

const palette = {
  primary: { main: '#031657', alternate: '#1C49C2' } /** Material Theme Customization */,
  secondary: { main: '#128CED' },
  white: '#fff',
  black: '#111',
  red: {
    ...redLegacy,
    100: '#FDE4E8', //copied from redLegacy.pastel
    500: '#B32605', //copied from redLegacy.medium
    600: '#BC2848',
    800: '#851940', //copied from redLegacy.dark
    900: '#611a15',
  },

  orange: { pastel: '', light: '', medium: '', dark: '#E66700' },
  green: { pastel: '#E8F7EB', light: '', medium: '#0A8E4E', dark: '#006B2B' },
  yellow: {
    400: '#FFC80C',
    pastel: '#FFE4BB',
    light: '',
    medium: '#EF6C00',
    dark: '#B06F00',
    amber: '#E66700',
  },
  blue: {
    ...blueLegacy,
    100: '#DBEBF9', //copied from blueLegacy.pastel
    300: '#A3CEF9', //copied from blueLegacy.baby,
    500: '#128CED', //copied from blueLegacy.light,
    600: '#1B49C2', // color droppered from from CSRBI-83
    800: '#031657', //copied from blueLegacy.dark Chewy / Brand - High Emphasis
    chewyBrand: '#1C49C2',
    skyBlue: '#00BFFF',
  },
  pink: { baby: '#FE8FB0' },
  gray: {
    50: '#F5F5F5', // "Chewy / Greyscale / Background Header"
    100: '#eee',
    150: '#ddd',
    175: '#CCCCCC', //"Shade / Low Emphasis"
    200: '#bdbdbd',
    300: '#dbebf9',
    350: '#FFFFFF80', //white 50 percent opacity
    375: alpha('#919191', 0.2),
    400: '#999', // "Chewy / Greyscale / Text Light"
    500: '#666',
    light: '#666666', // Shade / Medium Emphasis
    'medium-light': '#555555',
    medium: '#333', // TODO: get the figma value for this one
    dark: '#121212', // "Shade / Highest Emphasis"
  },
};

const spacing = (rems) => `${rems}rem`;

utils.fromPx = (px) => spacing((px / 16).toFixed(4));

// @alias 'margin'
const m = (px) => ({ margin: utils.fromPx(px) });

// @alias 'marginLeft' // 'marginRight'
m.x = (px) => {
  const rem = utils.fromPx(px);
  return { marginLeft: rem, marginRight: rem };
};

// @alias 'marginTop' // 'marginBottom'
m.y = (px) => {
  const rem = utils.fromPx(px);
  return { marginTop: rem, marginBottom: rem };
};

m.b = (px) => ({ marginBottom: utils.fromPx(px) });
m.t = (px) => ({ marginTop: utils.fromPx(px) });
m.r = (px) => ({ marginRight: utils.fromPx(px) });
m.l = (px) => ({ marginLeft: utils.fromPx(px) });

// @alias 'padding'
const p = (px) => ({ padding: utils.fromPx(px) });

// @alias 'paddingLeft' // 'paddingRight'
p.x = (px) => {
  const rem = utils.fromPx(px);
  return { paddingLeft: rem, paddingRight: rem };
};

// @alias 'paddingTop' // 'paddingBottom'
p.y = (px) => {
  const rem = utils.fromPx(px);
  return { paddingTop: rem, paddingBottom: rem };
};

p.b = (px) => ({ paddingBottom: utils.fromPx(px) });
p.t = (px) => ({ paddingTop: utils.fromPx(px) });
p.l = (px) => ({ paddingLeft: utils.fromPx(px) });
p.r = (px) => ({ paddingRight: utils.fromPx(px) });

const typography = {
  fontFamily: 'Roboto, sans-serif', // TODO figure out font families
  fontSize: 14,
};

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

const animations = {
  sidebar: {
    '@keyframes myEffect': {
      '0%': {
        transform: 'translateX(200%)',
      },
      '100%': {
        transform: 'translateX(0)',
      },
    },
    '@keyframes myEffectExit': {
      '0%': {
        transform: 'translateX(0)',
      },
      '100%': {
        transform: 'translateX(200%)',
      },
    },
  },
};

export default responsiveFontSizes(
  createTheme({
    fonts,
    borders,
    palette,
    spacing,
    typography,
    breakpoints,
    utils,
    animations,
    m,
    p,
  }),
);

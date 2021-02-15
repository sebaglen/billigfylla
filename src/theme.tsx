import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
});

const theme = extendTheme({
  colors: {
    black: '#242424',
    brand: '#DADD5C',
    darkGrey: '#DCDCDC',
    lightGrey: '#F4F4F4',
  },
  fonts,
  fontSizes: {
    xs: '9px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '24px',
    '2xl': '36px',
  },
  fontWeights: {
    thin: 300,
    regular: 400,
    bold: 600,
  },
  breakpoints,
  components: {
    Button: {
      variants: {
        toggled: {
          backgroundColor: 'brand',
          border: '1px solid',
          borderColor: 'brand',
        },
        notToggled: {
          border: '1px solid',
          borderColor: 'darkGrey',
        },
      },
      baseStyle: {
        _focus: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;

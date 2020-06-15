import { createMuiTheme } from '@material-ui/core/styles';

const KAGAMINE_YELLOW = '#fdd002';
const KAGAMINE_BLUE = '#1282c3';

const pxToRem = px => `${px / 16}rem`;

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: KAGAMINE_YELLOW
    },
    secondary: {
      main: KAGAMINE_BLUE
    },
    background: {
      default: '#fff'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 820,
      lg: 1000
    }
  },
  typography: {
    fontSize: 19,
    pxToRem,
    h1: {
      fontSize: pxToRem(30),
      fontWeight: 700
    },
    h2: {
      fontSize: pxToRem(26),
      fontWeight: 700
    },
    h3: {
      fontSize: pxToRem(22),
      fontWeight: 700
    },
    body2: {
      fontSize: pxToRem(19),
      lineHeight: 1.7
    },
    subtitle1: {
      fontSize: pxToRem(15),
      fontWeight: 400
    }
  },
  overrides: {
    MuiButton: {
      // Fix button icons not matching icon buttons
      iconSizeSmall: {
        marginRight: 4,
        '& > *:first-child': {
          fontSize: pxToRem(20)
        }
      },
      iconSizeMedium: {
        '& > *:first-child': {
          fontSize: pxToRem(24)
        }
      },
      iconSizeLarge: {
        '& > *:first-child': {
          fontSize: pxToRem(35)
        }
      }
    },
    MuiIconButton: {
      root: {
        color: 'inherit'
      },
      sizeSmall: { // Fix small size not matching SvgIcon
        fontSize: pxToRem(20)
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        fontSize: pxToRem(11)
      }
    }
  },
  props: {
    MuiCard: {
      variant: 'outlined'
    },
    MuiButton: {
      disableElevation: true
    },
    MuiTooltip: {
      placement: 'top'
    }
  }
});

// Apply styles to html elements for markdown
theme.overrides.MuiCssBaseline = {
  '@global': {
    h2: {
      ...theme.typography.h2,
      margin: theme.spacing(6, 0, 3),

      // Short underline
      paddingBottom: theme.spacing(1) + 4 /* height */,
      position: 'relative',
      '&::after': {
        content: '" "',
        width: 30,
        height: 4,
        position: 'absolute',
        left: 0,
        bottom: 0,
        background: theme.palette.primary.main
      }
    },
    h3: {
      ...theme.typography.h3,
      margin: theme.spacing(6, 0, 3)
    },
    p: {
      margin: theme.spacing(2, 0)
    }
  }
};

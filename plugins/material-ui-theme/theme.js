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
    fontSize: 20,
    pxToRem,
    h1: {
      fontSize: pxToRem(30),
      fontWeight: 700
    },
    h2: {
      fontSize: pxToRem(25),
      fontWeight: 700
    },
    h3: {
      fontSize: pxToRem(20),
      fontWeight: 700
    },
    subtitle1: {
      fontSize: pxToRem(14),
      fontWeight: 400
    },
    body2: {
      fontSize: pxToRem(20),
      lineHeight: 1.6
    }
  },
  overrides: {
    MuiIconButton: {
      root: {
        color: 'inherit'
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
    }
  }
});

// Apply styles to html elements
theme.overrides.MuiCssBaseline = {
  '@global': {
    h1: {
      ...theme.typography.h1
    },
    h2: {
      ...theme.typography.h2,
      margin: theme.spacing(2, 0)
    },
    h3: {
      ...theme.typography.h3,
      margin: theme.spacing(2, 0)
    },
    p: {
      margin: theme.spacing(2, 0)
    }
  }
};

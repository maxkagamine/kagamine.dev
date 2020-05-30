import { createMuiTheme } from '@material-ui/core/styles';

const KAGAMINE_YELLOW = '#fdd002';
const KAGAMINE_BLUE = '#1282c3';

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
  overrides: {
    MuiIconButton: {
      root: {
        color: 'inherit'
      }
    }
  }
});

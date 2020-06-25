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
    fontFamily: '"Roboto", "Noto Sans JP", sans-serif',
    fontSize: 19,
    pxToRem,
    h1: {
      fontSize: pxToRem(30),
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: pxToRem(26),
      fontWeight: 700,
      letterSpacing: '-0.015em'
    },
    h3: {
      fontSize: pxToRem(22),
      fontWeight: 700,
      letterSpacing: '-0.01em'
    },
    body2: {
      fontSize: pxToRem(19),
      lineHeight: 1.7
    },
    subtitle1: {
      fontSize: pxToRem(15),
      fontWeight: 400,
      lineHeight: 1.2
    },
    overline: {
      fontWeight: 700,
      color: 'rgba(0, 0, 0, 0.65)'
    }
  },
  overrides: {
    MuiButton: {
      root: { // Fix alignment
        lineHeight: pxToRem(23),
        '&:lang(ja)': { // Skipping 500 weight for Japanese to save on bytes
          fontWeight: 700
        }
      },
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
    a: {
      color: theme.palette.secondary.main,
      '&:not(:hover)': {
        textDecoration: 'none'
      }
    },
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
    'p, pre, blockquote': {
      margin: theme.spacing(2, 0)
    },
    img: {
      maxWidth: '100%',
      height: 'auto'
    },
    code: {
      fontFamily: '"Roboto Mono", "Noto Sans JP", monospace',
      fontSize: 14 // Using rem here causes it to be 19.6923px for some reason
    },
    'code:not(.grvsc-code)': {
      // gatsby-remark-vscode's inline code support is currently a bit annoying
      // and doesn't handle plain text; using a GitHub-like style instead
      background: theme.palette.grey['200'],
      padding: '0.2em 0.4em',
      fontSize: '0.9em',
      borderRadius: theme.shape.borderRadius
    },
    'pre.grvsc-container': {
      borderRadius: theme.shape.borderRadius,
      '&.one-dark-pro': {
        background: '#23272e' // I use a slighly darker bg in my settings.json
      }
    },
    blockquote: {
      borderLeft: `4px solid ${theme.palette.grey['400']}`,
      background: theme.palette.grey['50'],
      padding: theme.spacing(0, 3),
      overflow: 'hidden', // Keep children's margins inside
      fontStyle: 'italic',
      borderRadius: theme.shape.borderRadius
    }
  }
};

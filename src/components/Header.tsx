import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import { Link } from 'gatsby';
import nameEnImageUrl from '../images/name.en.png';
import nameEn2xImageUrl from '../images/name.en@2x.png';
import nameEn3xImageUrl from '../images/name.en@3x.png';
import nameEn4xImageUrl from '../images/name.en@4x.png';

interface HeaderProps {
  /**
   * If true, the name will be a link back to the homepage.
   */
  isHome: boolean;
}

function linearScaleBreakpoints(x1: number, y1: number, x2: number, y2: number): string {
  let slope = (y2 - y1) / (x2 - x1);
  let intercept = y1 - (slope * x1);
  return `clamp(${Math.min(y1, y2)}px, calc(${slope * 100}vw + ${intercept}px), ${Math.max(y1, y2)}px)`;
}

const HEIGHT = 200;
const HEIGHT_MOBILE = 56; // Toolbar height

const ICON_SIZE = 27;
const ICON_SIZE_MOBILE = 20;
const BUTTON_SIZE = ICON_SIZE * 1.9;
const BUTTON_SPACING = ICON_SIZE * 2; // Visual spacing, includes padding
const BUTTON_SPACING_MOBILE = ICON_SIZE / 2; // Drop to half icon-width gap on mobile
const BUTTON_MARGIN = BUTTON_SPACING - (BUTTON_SIZE - ICON_SIZE); // Subtract padding to get actual margin between buttons
const BUTTON_MARGIN_MOBILE = BUTTON_SPACING_MOBILE - (BUTTON_SIZE - ICON_SIZE);

const NAME_EN_WIDTH = 435;
const NAME_EN_WIDTH_MOBILE = 170;
// const NAME_JA_WIDTH = 335;
// const NAME_JA_WIDTH_MOBILE = 112;

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: linearScaleBreakpoints(
      theme.breakpoints.values.lg, HEIGHT,
      theme.breakpoints.values.sm, HEIGHT_MOBILE
    ),
    backgroundColor: theme.palette.primary.main
  },
  buttons: {
    fontSize: linearScaleBreakpoints(
      theme.breakpoints.values.md, ICON_SIZE,
      theme.breakpoints.values.sm, ICON_SIZE_MOBILE
    ),
    margin: `0 ${linearScaleBreakpoints(
      theme.breakpoints.values.md, BUTTON_SPACING,
      theme.breakpoints.values.sm, BUTTON_SPACING_MOBILE
    )}`,
    '& a + a': {
      marginLeft: linearScaleBreakpoints(
        theme.breakpoints.values.md, BUTTON_MARGIN,
        theme.breakpoints.values.sm, BUTTON_MARGIN_MOBILE
      )
    }
  },
  button: {
    fontSize: 'inherit',
    padding: 0,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  twitter: {
    fontSize: '1.25em' // Match height of github icon visually
  },
  nameContainer: {
    flex: 1,
    maxWidth: theme.breakpoints.values.md - theme.spacing(6) - (BUTTON_SPACING * 2), // Align with Container
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& img': {
      display: 'block',
      border: 'none',
      maxWidth: '100%'
    }
  },
  nameEn: {
    width: linearScaleBreakpoints(
      theme.breakpoints.values.lg, NAME_EN_WIDTH,
      theme.breakpoints.values.sm, NAME_EN_WIDTH_MOBILE
    )
  }
}));

export default function Header(props: HeaderProps) {
  const { isHome } = props;
  const classes = useStyles(props);

  // TODO: Localize
  let nameImage = (
    <img
      srcSet={`
        ${nameEnImageUrl},
        ${nameEn2xImageUrl} 2x,
        ${nameEn3xImageUrl} 3x,
        ${nameEn4xImageUrl} 4x`}
      src={nameEnImageUrl}
      alt='Max Kagamine'
      className={classes.nameEn}
    />
  );

  return (
    <header className={classes.root}>
      <div className={classes.buttons}>
        <IconButton
          href='https://github.com/maxkagamine'
          target='_blank'
          rel='noopener noreferrer'
          edge='start'
          className={classes.button}
        >
          <GitHubIcon fontSize='inherit' />
        </IconButton>
        <IconButton
          href='https://twitter.com/maxkagamine'
          target='_blank'
          rel='noopener noreferrer'
          edge='end'
          className={classes.button}
        >
          <TwitterIcon className={classes.twitter} />
        </IconButton>
      </div>
      <div className={classes.nameContainer}>
        {isHome ? nameImage : (
          <Link to='/'>{nameImage}</Link>
        )}
      </div>
      <div className={classes.buttons}>
        {/* TODO: Flags */}
        <IconButton href='#' edge='start' className={classes.button}>
          <GitHubIcon fontSize='inherit' />
        </IconButton>
        <IconButton href='#' edge='end' className={classes.button}>
          <GitHubIcon fontSize='inherit' />
        </IconButton>
      </div>
    </header>
  );
}

import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import { Link } from 'gatsby';
import React from 'react';
import nameEnSrc from '../../images/name.en.png';
import nameEn2xSrc from '../../images/name.en@2x.png';
import nameEn3xSrc from '../../images/name.en@3x.png';
import nameEn4xSrc from '../../images/name.en@4x.png';
import { csslerp } from '../../utils/csslerp';
import { JapanFlagIcon } from './JapanFlagIcon';
import { USFlagIcon } from './USFlagIcon';

interface HeaderProps {
  /**
   * If false, the name will be a link back to the homepage.
   */
  isHome: boolean;
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
    height: csslerp(
      theme.breakpoints.values.lg, HEIGHT,
      theme.breakpoints.values.sm, HEIGHT_MOBILE
    ),
    backgroundColor: theme.palette.primary.main
  },
  buttons: {
    fontSize: csslerp(
      theme.breakpoints.values.md, ICON_SIZE,
      theme.breakpoints.values.sm, ICON_SIZE_MOBILE
    ),
    margin: `0 ${csslerp(
      theme.breakpoints.values.md, BUTTON_SPACING,
      theme.breakpoints.values.sm, BUTTON_SPACING_MOBILE
    )}`,
    '& a + a': {
      marginLeft: csslerp(
        theme.breakpoints.values.md, BUTTON_MARGIN,
        theme.breakpoints.values.sm, BUTTON_MARGIN_MOBILE
      )
    },
    '& a': {
      fontSize: 'inherit',
      padding: 0,
      width: BUTTON_SIZE,
      height: BUTTON_SIZE
    }
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
    width: csslerp(
      theme.breakpoints.values.lg, NAME_EN_WIDTH,
      theme.breakpoints.values.sm, NAME_EN_WIDTH_MOBILE
    )
  }
}));

export function Header(props: HeaderProps) {
  const { isHome } = props;
  const classes = useStyles(props);

  // TODO: Localize
  let nameImg = (
    <img
      srcSet={`
        ${nameEnSrc},
        ${nameEn2xSrc} 2x,
        ${nameEn3xSrc} 3x,
        ${nameEn4xSrc} 4x`}
      src={nameEnSrc}
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
          aria-label='GitHub' /* TODO: Localize */
        >
          <GitHubIcon fontSize='inherit' />
        </IconButton>
        <IconButton
          href='https://twitter.com/maxkagamine'
          target='_blank'
          rel='noopener noreferrer'
          edge='end'
          aria-label='Twitter' /* TODO: Localize */
        >
          <TwitterIcon className={classes.twitter} />
        </IconButton>
      </div>
      <div className={classes.nameContainer}>
        {isHome ? nameImg : (
          <Link to='/'>{nameImg}</Link>
        )}
      </div>
      <div className={classes.buttons}>
        <IconButton
          href='#'
          edge='start'
          aria-label='English' /* TODO: Localize */
        >
          <USFlagIcon fontSize='inherit' />
        </IconButton>
        <IconButton
          href='#'
          edge='end'
          aria-label='Japanese' /* TODO: Localize */
        >
          <JapanFlagIcon fontSize='inherit' />
        </IconButton>
      </div>
    </header>
  );
}

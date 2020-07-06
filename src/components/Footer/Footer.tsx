import { Container, IconButton, Tooltip, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import React from 'react';
import { useIntl } from 'react-intl';
import { MusicIcon } from './MusicIcon';

const useStyles = makeStyles(theme => createStyles({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: 'rgba(0, 0, 0, 0.65)',
    fontWeight: 500
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridAutoFlow: 'column',
    gridColumnGap: theme.spacing(2),
    alignItems: 'center',
    height: 56 // Same as mobile-size header
  },
  button: {
    fontSize: '1.2em'
  },
  edgeEnd: {
    marginRight: -3 // Same as edge='end' but on its wrapper to keep tooltip aligned
  }
}));

export function Footer(props: {}) {
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Typography component='footer' variant='subtitle1' className={classes.root} data-nosnippet>
      <Container maxWidth='md' className={classes.container}>
        <div>
          © {intl.formatMessage({ id: 'name' })}
        </div>
        <Tooltip title={intl.formatMessage({ id: 'github' })}>
          <span>
            <IconButton
              href='https://github.com/maxkagamine'
              target='_blank'
              rel='noopener noreferrer'
              size='small'
              className={classes.button}
            >
              <GitHubIcon fontSize='inherit' />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={intl.formatMessage({ id: 'twitter' })}>
          <span>
            <IconButton
              href='https://twitter.com/maxkagamine'
              target='_blank'
              rel='noopener noreferrer'
              size='small'
              className={classes.button}
            >
              <TwitterIcon fontSize='inherit' />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='? ? ?'>
          <span className={classes.edgeEnd}>
            <IconButton
              href='https://www.youtube.com/watch?v=hSHxPPV2zKU&amp;list=PLYooEAFUfhDfevWFKLa7gh3BogBUAebYO'
              target='_blank'
              rel='noopener noreferrer'
              size='small'
              className={classes.button}
            >
              <MusicIcon fontSize='inherit' />
            </IconButton>
          </span>
        </Tooltip>
      </Container>
    </Typography>
  );
}

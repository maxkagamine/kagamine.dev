import { Button, IconButton, Tooltip, useMediaQuery } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import React from 'react';
import { useIntl } from 'react-intl';

// TODO: Wire up blog buttons

interface BlogButtonsProps {

}

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'grid',
    grid: 'auto / auto-flow max-content',
    justifyContent: 'end',
    alignItems: 'center',
    columnGap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      columnGap: theme.spacing(2),
      marginTop: -theme.spacing(1)
    }
  },
  notificationsButton: {
    lineHeight: theme.typography.pxToRem(23) // Fix alignment
  },
  notificationsTooltip: {
    maxWidth: 'none'
  },
  iconButtonWrapper: { // Match regular button height
    height: 36,
    display: 'flex',
    alignItems: 'center'
  }
}));

export function BlogButtons(props: BlogButtonsProps) {
  const classes = useStyles(props);
  const isMobile = useMediaQuery<Theme>(theme => theme.breakpoints.down('xs'));
  const intl = useIntl();

  return (
    <div className={classes.root}>
      <Tooltip
        title={intl.formatMessage({ id: 'notificationsTooltip' })}
        classes={{ tooltip: classes.notificationsTooltip }}
      >
        <Button
          startIcon={<NotificationsNoneIcon />}
          className={classes.notificationsButton}
          size={isMobile ? 'small' : 'medium'}
        >
          {intl.formatMessage({ id: 'notificationsButton' })}
        </Button>
      </Tooltip>
      <Tooltip title={intl.formatMessage({ id: 'rssFeedTooltip' })}>
        <div className={classes.iconButtonWrapper}>
          <IconButton
            edge='end'
            size={isMobile ? 'small' : 'medium'}
          >
            <RssFeedIcon fontSize='inherit' />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  );
}

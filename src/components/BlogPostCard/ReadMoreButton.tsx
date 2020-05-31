import { Button, ButtonProps } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { useIntl } from 'react-intl';

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'block',
    margin: theme.spacing(2, 'auto', 0),
    pointerEvents: 'none' // The button is just an indication that the card is clickable
  }
}));

export function ReadMoreButton(props: ButtonProps) {
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Button
      {...props}
      color='primary'
      variant='contained'
      className={clsx(classes.root, props.className)}
    >
      {intl.formatMessage({ id: 'readMore' })}
    </Button>
  );
}

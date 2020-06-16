import { IconButton, IconButtonProps } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: 36, // Regular button height
    borderRadius: '50%' // Keep tooltips from showing when not over button
  },
  small: {
    height: 31
  },
  smallButton: {
    padding: 10,
    marginLeft: -5, // Regular buttons have 5px side padding
    marginRight: -5
  }
});

/**
 * Keeps icon buttons (and their tooltips) aligned with regular buttons while
 * letting their circle overflow.
 */
export const AlignedIconButton = React.forwardRef<HTMLDivElement, IconButtonProps>((props, ref) => {
  const classes = useStyles(props);
  const theme = useTheme();

  let small = (props.size ?? theme.props?.MuiIconButton?.size) == 'small';

  return (
    <div className={clsx(classes.root, { [classes.small]: small })} ref={ref}>
      <IconButton {...props} className={clsx(props.className, { [classes.smallButton]: small })} />
    </div>
  );
});

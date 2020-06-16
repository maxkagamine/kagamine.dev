import { Toolbar, useMediaQuery } from '@material-ui/core';
import { createMuiTheme, createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';

interface PageButtonsProps {
  align?: 'left' | 'right';

  dense?: boolean;

  children: React.ReactNode;
}

const useStyles = makeStyles(theme => createStyles<string, PageButtonsProps>({
  root: {
    display: 'grid',
    grid: 'auto / auto-flow max-content',
    justifyContent: ({ align }) => align == 'right' ? 'end' : 'start',
    alignItems: 'center',
    columnGap: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      columnGap: theme.spacing(2),
      marginTop: -theme.spacing(2)
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: 'auto',
      marginBottom: ({ dense }) => theme.spacing(dense ? 1 : 2)
    }
  }
}));

export function PageButtons(props: PageButtonsProps) {
  const { children } = props;
  const classes = useStyles(props);
  const isMobile = useMediaQuery<Theme>(theme => theme.breakpoints.down('xs'));

  let toolbar = (
    <Toolbar className={classes.root} disableGutters>
      {children}
    </Toolbar>
  );

  if (isMobile) {
    // Material-UI lets us override components' default props using the theme,
    // so we can automatically set nested buttons to size small on mobile
    return (
      <ThemeProvider
        theme={theme => createMuiTheme({
          ...theme,
          props: {
            MuiButton: { size: 'small' },
            MuiIconButton: { size: 'small' }
          }
        })}
      >
        {toolbar}
      </ThemeProvider>
    );
  }

  return toolbar;
}

import { useMediaQuery } from '@material-ui/core';
import { createMuiTheme, createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

interface PageControlsProps {
  children: React.ReactNode;

  [key: string]: any;
}

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(-1, 0, 1)
    }
  },
  alignRight: {
    justifyContent: 'flex-end'
  },
  area: {
    display: 'grid',
    grid: 'auto / auto-flow max-content',
    alignItems: 'center',
    columnGap: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      columnGap: theme.spacing(2)
    }
  }
}));

export function PageControls(props: PageControlsProps) {
  const { className, children, ...rest } = props;
  const classes = useStyles(props);
  const isMobile = useMediaQuery<Theme>(theme => theme.breakpoints.down('xs'));

  let areas: [React.ReactNode, React.ReactNode] = [undefined, undefined];
  let otherChildren: React.ReactNode[] = [];

  React.Children.forEach(children, child => {
    let element = child as React.ReactElement;
    let name = (child as any)?.type?.displayName;
    if (name == 'PageControls.Left' || name == 'PageControls.Right') {
      let area = React.cloneElement(element, {
        className: clsx(element.props.className, classes.area)
      });
      areas[name == 'PageControls.Left' ? 0 : 1] = area;
    } else {
      otherChildren.push(child);
    }
  });

  let component = (
    <div {...rest} className={clsx(className, classes.root, { [classes.alignRight]: !areas[0] })}>
      {areas}
      {otherChildren}
    </div>
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
        {component}
      </ThemeProvider>
    );
  }

  return component;
}

/**
 * Creates a dummy container component for grouping/alignment purposes.
 */
function createPageControlsArea(name: string) {
  let component: React.FC = ({ ...rest }: {}) => <div {...rest} />;
  component.displayName = name;
  return component;
}

PageControls.Left = createPageControlsArea('PageControls.Left');
PageControls.Right = createPageControlsArea('PageControls.Right');

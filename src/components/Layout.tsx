import React from 'react';
import { WindowLocation } from '@reach/router';
import { Helmet } from 'react-helmet';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

declare var __PATH_PREFIX__: string;

interface LayoutProps {
  location: WindowLocation;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { children } = props;
  // const isHome = location.pathname == `${__PATH_PREFIX__}/`;

  return (
    <div>
      <Helmet>
        <title>Max Kagamine</title> {/* TODO: Localize */}
      </Helmet>
      <AppBar position='static'>
        <Toolbar>
          Stuff here
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
}

import React from 'react';
import { WindowLocation } from '@reach/router';
import { Helmet } from 'react-helmet';
import Container from '@material-ui/core/Container';
import Header from './Header';

interface LayoutProps {
  location: WindowLocation;
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  const { location, children } = props;
  const isHome = location.pathname == `${__PATH_PREFIX__}/`;

  return (
    <div>
      <Helmet>
        <title>Max Kagamine</title> {/* TODO: Localize */}
      </Helmet>
      <Header isHome={isHome} />
      <Container maxWidth='md'>
        {children}
      </Container>
    </div>
  );
}

import Container from '@material-ui/core/Container';
import { WindowLocation } from '@reach/router';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Header } from '../Header';

interface LayoutProps {
  location: WindowLocation;
  children: React.ReactNode;
}

const HOME_REGEX = new RegExp(`${__PATH_PREFIX__}/[^/]+/?`);

export function Layout(props: LayoutProps) {
  const { location, children } = props;
  const intl = useIntl();

  const isHome = HOME_REGEX.test(location.pathname);

  return (
    <div>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{intl.formatMessage({ id: 'name' })}</title>
      </Helmet>
      <Header isHome={isHome} />
      <Container maxWidth='md'>
        {children}
      </Container>
    </div>
  );
}

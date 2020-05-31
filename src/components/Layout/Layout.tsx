import { Container } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { WindowLocation } from '@reach/router';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Header } from '../Header';

interface LayoutProps {
  location: WindowLocation;
  children: React.ReactNode;
}

const useStyles = makeStyles(theme => createStyles({
  main: {
    margin: theme.spacing(6, 'auto'),
    [theme.breakpoints.only('sm')]: {
      margin: theme.spacing(4, 'auto')
    },
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2, 'auto')
    }
  }
}));

export function Layout(props: LayoutProps) {
  const { location, children } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const isHome = /\/[^/]+\/?/.test(location.pathname);

  return (
    <>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{intl.formatMessage({ id: 'name' })}</title>
      </Helmet>
      <Header isHome={isHome} />
      <Container component='main' maxWidth='md' className={classes.main}>
        {children}
      </Container>
    </>
  );
}

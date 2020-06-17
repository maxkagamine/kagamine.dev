import { Container } from '@material-ui/core';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { WindowLocation } from '@reach/router';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Header } from '../Header';

interface LayoutProps {
  /**
   * The location object.
   */
  location: WindowLocation;

  /**
   * All available translations for this page as a map of locale to path.
   */
  translations: Record<string, string>;

  children: React.ReactNode;
}

const useStyles = makeStyles(theme => createStyles({
  main: {
    margin: theme.spacing(6, 'auto'),
    [theme.breakpoints.only('sm')]: {
      margin: theme.spacing(3, 'auto')
    },
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2, 'auto')
    }
  }
}));

export function Layout(props: LayoutProps) {
  const { location, translations, children } = props;
  const data = useStaticQuery<GatsbyTypes.LayoutQuery>(graphql`
    query Layout {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);
  const classes = useStyles(props);
  const theme = useTheme();
  const intl = useIntl();

  const isHome = /^\/[^/]+\/?$/.test(location.pathname);
  const toAbsolute = (path: string) => `${data.site!.siteMetadata!.siteUrl}${path}`;

  return (
    <>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{intl.formatMessage({ id: 'name' })}</title>
        <meta name='theme-color' content={theme.palette.primary.main} />
        <link rel='canonical' href={toAbsolute(translations[intl.locale])} />
        {Object.entries(translations).map(([locale, path]) => path &&
          <link rel='alternate' href={toAbsolute(path)} hrefLang={locale} key={locale} />)}
      </Helmet>
      <Header isHome={isHome} translations={translations} />
      <Container component='main' maxWidth='md' className={classes.main}>
        {children}
      </Container>
    </>
  );
}

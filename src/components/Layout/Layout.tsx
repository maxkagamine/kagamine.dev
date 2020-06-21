import { Container } from '@material-ui/core';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { WindowLocation } from '@reach/router';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import profileSrc from '../../images/profile.png';
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

  /**
   * The page title.
   */
  title?: string;

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
  const { location, translations, title, children } = props;
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

  const toAbsolute = (path: string) => `${data.site!.siteMetadata!.siteUrl}${path}`;

  const isHome = /^\/[^/]+\/?$/.test(location.pathname);
  const name = intl.formatMessage({ id: 'name' });
  const canonical = toAbsolute(translations[intl.locale]);

  return (
    <>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>{title ?? name}</title>
        <meta name='theme-color' content={theme.palette.primary.main} />
        <link rel='canonical' href={canonical} />
        {Object.entries(translations).map(([locale, path]) => path &&
          <link rel='alternate' href={toAbsolute(path)} hrefLang={locale} key={locale} />)}
        <link rel='me' href='https://twitter.com/maxkagamine' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={title ?? name} />
        <meta property='og:image' content={toAbsolute(profileSrc)} />
        <meta property='og:url' content={canonical} />
        <meta property='og:site_name' content={name} />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@maxkagamine' />
      </Helmet>
      <Header isHome={isHome} translations={translations} />
      <Container component='main' maxWidth='md' className={classes.main}>
        {children}
      </Container>
    </>
  );
}

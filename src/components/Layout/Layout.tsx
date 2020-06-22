import { Container } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { WindowLocation } from '@reach/router';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { Header } from '../Header';
import { Metadata, PageMetadata } from '../Metadata';

interface LayoutProps {
  /**
   * The location object.
   */
  location: WindowLocation;

  /**
   * All available translations for the page as a map of locale to site-relative
   * url, including the current locale.
   */
  alternateUrls: Record<string, string>;

  /**
   * The page's metadata.
   */
  metadata?: PageMetadata;

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
  const { location, alternateUrls, metadata, children } = props;
  const data = useStaticQuery<GatsbyTypes.LayoutQuery>(graphql`
    query Layout {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);
  const siteUrl = data.site!.siteMetadata!.siteUrl!;
  const classes = useStyles(props);

  const isHome = /^\/[^/]+\/?$/.test(location.pathname);

  return (
    <>
      <Metadata metadata={metadata} siteUrl={siteUrl} alternateUrls={alternateUrls} isHome={isHome} />
      <Header isHome={isHome} alternateUrls={alternateUrls} />
      <Container component='main' maxWidth='md' className={classes.main}>
        {children}
      </Container>
    </>
  );
}

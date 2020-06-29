import { Button, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';

// TODO: Switch this back to webp once on Win10/WSL (webp transparency broken
// on windows: https://github.com/gatsbyjs/gatsby/issues/14497)
export const query = graphql`
  query FourOhFour {
    file(relativePath: {eq: "rin-kongou-chuuha.png"}) {
      childImageSharp {
        fluid(maxWidth: 670) {
          ...GatsbyImageSharpFluid_noBase64
        }
      }
    }
  }
`;

const useStyles = makeStyles(theme => createStyles({
  '@global': {
    'html, body, #___gatsby, #gatsby-focus-wrapper, main': {
      // Fill viewport (100vh causes address bar scrolling on mobile)
      height: '100%'
    },
    body: {
      background: theme.palette.primary.main
    }
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(3, 0)
  },
  rin: {
    width: 670,
    maxWidth: '100%',
    marginBottom: '6vh',
    '& img': {
      objectFit: 'contain !important'
    }
  },
  message: {
    marginBottom: theme.spacing(4),
    padding: theme.spacing(0, 3),
    textAlign: 'center'
  }
}));

export default function FourOhFour({ data }: LocalizedPageProps<GatsbyTypes.FourOhFourQuery>) {
  const classes = useStyles();
  const intl = useIntl();

  // TODO: Use a single 404.html for all locales. Simply serving a localized 404
  // from a cloud function doesn't work, as the router expects a single page to
  // match a given url and will rewrite the url if it doesn't match the loaded
  // page. Currently, the localized pages are matching routes under their locale
  // prefix, but non-localized routes (e.g. /foo) are displaying the English 404
  // (cloned by the onCreatePage hook). Best solution is probably to give the
  // 404 page all locale's messages and defer rendering until client-side when
  // we can check `navigator.language`. SSR isn't super necessary for a 404
  // anyway. This also has the advantage of meeting the CDN's expectation of a
  // single /404.html (meaning can't get a 200 by hitting up /en/404).

  return (
    <main className={classes.root}>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>¯\_(ツ)_/¯</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <Img
        fluid={data.file!.childImageSharp!.fluid}
        loading='eager'
        fadeIn={false}
        className={classes.rin}
      />
      <Typography variant='h3' component='div' className={classes.message}>
        {intl.formatMessage({ id: 'notFoundMessage' })}
      </Typography>
      <Button component={Link} to={`/${intl.locale}/`} variant='outlined'>
        {intl.formatMessage({ id: 'notFoundBackToHome' })}
      </Button>
    </main>
  );
}

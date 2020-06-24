import { Button, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { graphql, Link, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { LocalizedPageProps } from '../utils/LocalizedPageProps';

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

export default function FourOhFour(props: LocalizedPageProps) {
  const classes = useStyles(props);
  // TODO: Switch this back to webp once on Win10/WSL (webp transparency broken
  // on windows: https://github.com/gatsbyjs/gatsby/issues/14497)
  const data = useStaticQuery<GatsbyTypes.FourOhFourQuery>(graphql`
    query FourOhFour {
      file(relativePath: {eq: "rin-kongou-chuuha.png"}) {
        childImageSharp {
          fluid(maxWidth: 670) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
    }
  `);
  const intl = useIntl();

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

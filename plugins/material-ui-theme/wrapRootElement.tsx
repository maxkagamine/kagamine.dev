import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { WrapRootElementNodeArgs } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';
import { theme } from './theme';

export const wrapRootElement = ({ element }: WrapRootElementNodeArgs) => <>
  <Helmet>
    <meta name='theme-color' content={theme.palette.primary.main} />
    <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Roboto+Mono&amp;family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,700&amp;display=swap' />
  </Helmet>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {element}
  </ThemeProvider>
</>;

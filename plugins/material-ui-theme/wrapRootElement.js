import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { Helmet } from 'react-helmet';
import { theme } from './theme';

export const wrapRootElement = ({ element }) => {
  return (
    <>
      <Helmet>
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&amp;display=swap' />
      </Helmet>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {element}
      </ThemeProvider>
    </>
  );
};

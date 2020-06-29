import { WrapPageElementNodeArgs } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';
import { IntlContext } from 'react-intl';

export const wrapPageElement = ({ element }: WrapPageElementNodeArgs) => (
  <IntlContext.Consumer>
    {intl => <>
      {intl.locale == 'ja' && (
        <Helmet>
          <link href='https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&amp;display=swap' rel='stylesheet' />
        </Helmet>
      )}
      {element}
    </>}
  </IntlContext.Consumer>
);

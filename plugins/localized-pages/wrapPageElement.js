import React from 'react';
import { IntlProvider } from 'react-intl';

export const wrapPageElement = ({ element, props }) => {
  const { locale, messages } = props.pageContext;
  return (
    <IntlProvider locale={locale} messages={messages}>
      {element}
    </IntlProvider>
  );
};

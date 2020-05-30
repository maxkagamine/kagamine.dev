import React from 'react';
import { IntlProvider } from 'react-intl';

export const wrapPageElement = ({ element, props }) => {
  const { locale, messages } = props.pageContext;

  let language = locale.split('-')[0];

  if (!Intl.PluralRules) {
    require('@formatjs/intl-pluralrules/polyfill');
    require(`@formatjs/intl-pluralrules/dist/locale-data/${language}`);
  }

  if (!Intl.RelativeTimeFormat) {
    require('@formatjs/intl-relativetimeformat/polyfill');
    require(`@formatjs/intl-relativetimeformat/dist/locale-data/${language}`);
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      {element}
    </IntlProvider>
  );
};

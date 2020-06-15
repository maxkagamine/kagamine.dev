import React from 'react';
import { IntlProvider } from 'react-intl';

export const wrapPageElement = ({ element, props }) => {
  const { locale, messages } = props.pageContext;

  let language = locale.split('-')[0];

  if (!Intl.PluralRules || (Intl.PluralRules.polyfilled && !Intl.PluralRules.localeData[language])) {
    require('@formatjs/intl-pluralrules/polyfill');
    require(`@formatjs/intl-pluralrules/dist/locale-data/${language}`);
  }

  if (!Intl.RelativeTimeFormat || (Intl.RelativeTimeFormat.polyfilled && !Intl.RelativeTimeFormat.localeData[language])) {
    require('@formatjs/intl-relativetimeformat/polyfill');
    require(`@formatjs/intl-relativetimeformat/dist/locale-data/${language}`);
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      {element}
    </IntlProvider>
  );
};

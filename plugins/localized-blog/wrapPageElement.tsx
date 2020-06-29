import { WrapPageElementNodeArgs } from 'gatsby';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { InternalLocalizedPageContext } from './types';

export const wrapPageElement = ({ element, props }: WrapPageElementNodeArgs<object, InternalLocalizedPageContext>) => {
  let { locale, messages } = props.pageContext;

  let language = locale.split('-')[0];
  let { PluralRules, RelativeTimeFormat } = Intl as any;

  if (!PluralRules || (PluralRules.polyfilled && !PluralRules.localeData[language])) {
    require('@formatjs/intl-pluralrules/polyfill');
    require(`@formatjs/intl-pluralrules/dist/locale-data/${language}`);
  }

  if (!RelativeTimeFormat || (RelativeTimeFormat.polyfilled && !RelativeTimeFormat.localeData[language])) {
    require('@formatjs/intl-relativetimeformat/polyfill');
    require(`@formatjs/intl-relativetimeformat/dist/locale-data/${language}`);
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      {element}
    </IntlProvider>
  );
};

import { WrapPageElementNodeArgs } from 'gatsby';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { InternalLocalizedPageContext, Messages } from './types';

// NOTE: The 404 page has to be a single 404.html at root, but to be consistent
// with the behavior of the root cloud function and display the user's preferred
// language (rather than just default to English), we're giving it all locales'
// messages and letting it choose the locale client-side instead based on
// `navigator.languages` if there's none in the url.
//
// While we could create localized 404 pages with matchPath setting their client
// routes as catch-alls for their respective locales, a root /404.html would
// still need to exist for 404s such as /foo, meaning it would need a "default"
// language. Attempting to serve one of the localized 404 pages there based on
// accept-language, using a cloud function as we do for the homepage, would
// result in the router rewriting the url from e.g. /foo to /en/404.html.
//
// SSR isn't super necessary for a 404 anyway, though, and this also lets us
// stick to the CDN's normal custom 404 page handling.

function polyfill(locale: string) {
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
}

function determineLocale(locales: string[]): string {
  let possibleLocales = [
    ...(document.location.pathname.match(/^\/((\w+)(?:-\w+)?)/)?.slice(1) ?? []), // [en-US, en]
    ...navigator.languages
  ];

  for (let possibleLocale of possibleLocales) {
    if (locales.some(l => l.toLowerCase() == possibleLocale.toLowerCase())) {
      return possibleLocale;
    }
  }

  return locales[0];
}

export const wrapPageElement = ({ element, props }: WrapPageElementNodeArgs<object, InternalLocalizedPageContext>) => {
  let { locale, locales, messages } = props.pageContext;
  let localeMessages = messages as Messages;

  // 404 page, see long comment at top
  if (locale == undefined) {
    // Defer rendering to client-side as we don't yet know the locale
    if (typeof window == 'undefined') {
      return null;
    }

    locale = determineLocale(locales!);
    localeMessages = messages[locale] as Messages;
  }

  polyfill(locale);

  return (
    <IntlProvider locale={locale} messages={localeMessages}>
      {element}
    </IntlProvider>
  );
};

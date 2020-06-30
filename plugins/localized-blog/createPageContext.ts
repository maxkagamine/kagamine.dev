import { parsedMessages } from './onPreInit';
import { InternalLocalizedPageContext } from './types';

/**
 * Creates a standard page context object. If locale is undefined, all locales'
 * messages will be given (used only for the 404 page).
 *
 * @param locale The page's locale.
 * @param alternateUrls All available translations for the page as a map of
 * locale to site-relative url, including the current locale.
 * @param additionalContext Additional properties to include.
 */
export function createPageContext(
  locale: string | undefined,
  alternateUrls: Record<string, string>,
  additionalContext: Omit<InternalLocalizedPageContext, 'locale' |  'messages' | 'alternateUrls'> = {}
): InternalLocalizedPageContext {
  return {
    locale,
    messages: locale == undefined ?
      Object.fromEntries(parsedMessages.entries()) :
      parsedMessages.get(locale)!,
    alternateUrls,
    ...additionalContext
  };
}

import { parsedMessages } from './onPreInit';
import { InternalLocalizedPageContext, LocalizedPageContext } from './types';

/**
 * Creates a standard page context object.
 *
 * @param locale The page's locale.
 * @param alternateUrls All available translations for the page as a map of
 * locale to site-relative url, including the current locale.
 * @param additionalContext Additional properties to include.
 */
export function createPageContext(
  locale: string,
  alternateUrls: Record<string, string>,
  additionalContext: Omit<LocalizedPageContext, 'alternateUrls'> = {}
): InternalLocalizedPageContext {
  return {
    locale,
    alternateUrls,
    messages: parsedMessages.get(locale)!,
    ...additionalContext
  };
}

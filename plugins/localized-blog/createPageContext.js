const { parsedMessages } = require('./onPreInit');

/**
 * Creates a standard page context object.
 *
 * @param {string} locale The page's locale.
 * @param {Object.<string, string>} translations All available translations for
 * this page as a map of locale to path.
 * @param {Object} [additionalContext] Additional properties to include.
 */
function createPageContext(locale, translations, additionalContext = {}) {
  return {
    locale,
    translations,
    messages: parsedMessages.get(locale),
    ...additionalContext
  };
}

module.exports = createPageContext;

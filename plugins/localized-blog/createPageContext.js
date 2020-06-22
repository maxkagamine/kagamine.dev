const { parsedMessages } = require('./onPreInit');

/**
 * Creates a standard page context object.
 *
 * @param {string} locale The page's locale.
 * @param {Object.<string, string>} alternateUrls All available translations for
 * the page as a map of locale to site-relative url, including the current
 * locale.
 * @param {Object} [additionalContext] Additional properties to include.
 */
function createPageContext(locale, alternateUrls, additionalContext = {}) {
  return {
    locale,
    alternateUrls,
    messages: parsedMessages.get(locale),
    ...additionalContext
  };
}

module.exports = createPageContext;

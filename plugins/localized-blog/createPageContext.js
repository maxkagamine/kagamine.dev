const { parsedMessages } = require('./onPreInit');

module.exports = (locale, additionalContext = {}) => ({
  locale,
  messages: parsedMessages.get(locale),
  ...additionalContext
});

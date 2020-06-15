const parser = require('intl-messageformat-parser');
const mapValues = require('lodash.mapvalues');

let parsedMessages = new Map();

module.exports = (_, pluginOptions) => {
  const { locales = [], messages: messagesDir = {} } = pluginOptions;

  // Pre-parse messages at build time
  for (let locale of locales) {
    let messages = require(`${messagesDir}/${locale}.json`);
    let parsed = mapValues(messages, m => parser.parse(m));
    parsedMessages.set(locale, parsed);
  }
};

module.exports.parsedMessages = parsedMessages;

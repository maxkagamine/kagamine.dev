const parser = require('intl-messageformat-parser');
const mapValues = require('lodash.mapvalues');

let parsedMessages = new Map();

exports.onPreInit = (_, pluginOptions) => {
  const { locales = [], messages: messagesDir = {} } = pluginOptions;

  // Pre-parse messages at build time
  for (let locale of locales) {
    let messages = require(`${messagesDir}/${locale}.json`);
    let parsed = mapValues(messages, m => parser.parse(m));
    parsedMessages.set(locale, parsed);
  }
};

exports.onCreatePage = async ({ page, actions }, pluginOptions) => {
  const { createPage, deletePage } = actions;
  const { locales = [] } = pluginOptions;

  // Remove automatically-generated page
  deletePage(page);

  // Create locale-specific pages
  for (let locale of locales) {
    // TODO: Handle 404 page
    createPage({
      ...page,
      path: `/${locale}${page.path}`,
      context: {
        locale,
        messages: parsedMessages.get(locale)
      }
    });
  }
};

const parser = require('intl-messageformat-parser');
const mapValues = require('lodash.mapvalues');
const webpack = require('webpack');

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

exports.onCreateWebpackConfig = ({ actions }, pluginOptions) => {
  const { locales = [] } = pluginOptions;

  // Restricts the modules that webpack bundles in order to cover the
  // interpolated requires in wrapPageElement, courtesy of:
  // https://github.com/wiziple/gatsby-plugin-intl/blob/master/src/gatsby-node.js
  let regex = new RegExp(locales.map(l => l.split('-')[0]).join('|'));
  actions.setWebpackConfig({
    plugins: [
      new webpack.ContextReplacementPlugin(
        /@formatjs[/\\]intl-relativetimeformat[/\\]dist[/\\]locale-data$/,
        regex
      ),
      new webpack.ContextReplacementPlugin(
        /@formatjs[/\\]intl-pluralrules[/\\]dist[/\\]locale-data$/,
        regex
      )
    ]
  });
};

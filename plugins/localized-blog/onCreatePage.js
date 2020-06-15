const { parsedMessages } = require('./onPreInit');

module.exports = async ({ page, actions }, pluginOptions) => {
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

exports.onCreatePage = async ({ page, actions }, pluginOptions) => {
  const { createPage, deletePage } = actions;
  const { locales = [], messages: messagesDir = {} } = pluginOptions;

  // Remove automatically-generated page
  deletePage(page);

  // Create locale-specific pages
  for (let locale of locales) {
    // Get messages (this is done at build-time, so no need to worry about the
    // interpolated require)
    // TODO: Pre-parse messages
    let messages = require(`${messagesDir}/${locale}.json`);

    // Rewrite path and pass locale & messages via context
    // TODO: Handle 404 page
    createPage({
      ...page,
      path: `/${locale}${page.path}`,
      context: {
        locale,
        messages
      }
    });
  }
};

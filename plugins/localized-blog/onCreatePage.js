const createPageContext = require('./createPageContext');

module.exports = async ({ page, actions }, pluginOptions) => {
  const { createPage, deletePage } = actions;
  const { locales = [] } = pluginOptions;

  // Remove automatically-generated page
  deletePage(page);

  // Create map of locales to paths
  let paths = Object.fromEntries(
    locales.map(locale => [locale, `/${locale}${page.path}`]));

  // Create locale-specific pages
  for (let locale of locales) {
    // TODO: Handle 404 page
    createPage({
      ...page,
      path: paths[locale],
      context: createPageContext(locale, paths)
    });
  }
};

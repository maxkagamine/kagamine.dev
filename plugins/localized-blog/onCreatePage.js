const createPageContext = require('./createPageContext');

/**
 * 404 pages need some special handling; breaking this out to avoid clutter.
 * Returns a boolean indicating whether the page was handled.
 */
function handle404(page, createPage, locales) {
  // Leave Gatsby's development 404 page deleted
  if (page.path == '/dev-404-page/') {
    return true;
  }

  // Gatsby creates /404.html but doesn't remove the /404/index.html; we can
  // safely get rid of these
  if (/^\/?404\/?$/.test(page.path)) {
    return true;
  }

  // Create 404.html pages under each locale, with matchPath set for client-side
  // routing; a cloud function will be used to route 404s to the correct locale
  if (page.path == '/404.html') {
    for (let locale of locales) {
      createPage({
        ...page,
        path: `/${locale}/404.html`,
        context: createPageContext(locale, {}),
        matchPath: `/${locale}/*`
      });
    }

    // We'll also leave a default 404.html at root as Gatsby expects
    createPage({
      ...page,
      context: createPageContext(locales[0], {})
    });

    return true;
  }

  return false;
}

module.exports = async ({ page, actions }, pluginOptions) => {
  const { createPage, deletePage } = actions;
  const { locales = [] } = pluginOptions;

  // Remove automatically-generated page
  deletePage(page);

  // Handle 404 pages
  if (handle404(page, createPage, locales)) {
    return;
  }

  // Create map of locales to paths
  let paths = Object.fromEntries(
    locales.map(locale => [locale, `/${locale}${page.path}`]));

  // Create locale-specific pages
  for (let locale of locales) {
    createPage({
      ...page,
      path: paths[locale],
      context: createPageContext(locale, paths)
    });
  }
};

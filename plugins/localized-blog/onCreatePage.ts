import { Actions, CreatePageArgs, Page } from 'gatsby';
import { createPageContext } from './createPageContext';
import { LocalizedBlogOptions } from './types';

/**
 * 404 pages need some special handling; breaking this out to avoid clutter.
 * Returns a boolean indicating whether the page was handled.
 */
function handle404(page: Page, createPage: Actions['createPage'], locales: string[]): boolean {
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
  // routing
  // NOTE: See todo in 404.tsx (original plan of using cloud function to route
  // to localized 404 does not work due to router behavior)
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

export const onCreatePage = async ({ page, actions }: CreatePageArgs, pluginOptions: LocalizedBlogOptions) => {
  let { createPage, deletePage } = actions;
  let { locales = [] } = pluginOptions;

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

import { CreatePageArgs } from 'gatsby';
import { createPageContext } from './createPageContext';
import { LocalizedBlogOptions } from './types';

export const onCreatePage = async ({ page, actions }: CreatePageArgs, pluginOptions: LocalizedBlogOptions) => {
  let { createPage, deletePage } = actions;
  let { locales = [] } = pluginOptions;

  // Remove automatically-generated page
  deletePage(page);

  // Leave Gatsby's development 404 page deleted. Gatsby also leaves behind a
  // /404/index.html when it creates /404.html; we can get rid of that too.
  if (page.path == '/dev-404-page/' || /^\/?404\/?$/.test(page.path)) {
    return;
  }

  // 404 page, see comment in wrapPageElement for how we're handling these
  if (page.path == '/404.html') {
    createPage({
      ...page,
      context: createPageContext(undefined, {}, { locales })
    });

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

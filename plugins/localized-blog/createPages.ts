import { GatsbyNode } from 'gatsby';
import groupBy from 'lodash.groupby';
import { createPageContext } from './createPageContext';
import { AllMarkdownRemarkQuery, LocalizedBlogOptions } from './types';

export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql }, pluginOptions: LocalizedBlogOptions) => {
  let { createPage } = actions;

  // Query blog posts
  let query: AllMarkdownRemarkQuery = await graphql(`
    query {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: ASC } # Sorted for prev/next
      ) {
        edges {
          node {
            fields {
              slug
              locale
              dirname
            }
          }
        }
      }
    }
  `);
  let data = query.data!;

  // Match up translations
  let alternateUrlsByDirname = data.allMarkdownRemark.edges.reduce((map, edge) => {
    let { slug, locale, dirname } = edge.node.fields;
    if (!map.has(dirname)) {
      map.set(dirname, {});
    }
    map.get(dirname)![locale] = slug;
    return map;
  }, new Map<string, Record<string, string>>());

  // Group by locale for getting prev/next (already sorted by query)
  let postsByLocale = groupBy(data.allMarkdownRemark.edges, x => x.node.fields.locale);

  // Create pages
  for (let edge of data.allMarkdownRemark.edges) {
    let { slug, locale, dirname } = edge.node.fields;
    let alternateUrls = alternateUrlsByDirname.get(dirname)!;

    let index = postsByLocale[locale].findIndex(x => x.node.fields.slug == slug);
    let previous = index == 0 ? undefined : postsByLocale[locale][index - 1].node.fields.slug;
    let next = index == postsByLocale[locale].length - 1 ? undefined : postsByLocale[locale][index + 1].node.fields.slug;

    createPage({
      path: slug,
      component: pluginOptions.blogPostTemplate,
      context: createPageContext(locale, alternateUrls, {
        slug,
        previous,
        next
      })
    });
  }
};

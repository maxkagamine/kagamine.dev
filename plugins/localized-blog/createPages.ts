import { GatsbyNode } from 'gatsby';
import { createPageContext } from './createPageContext';
import { AllMarkdownRemarkQuery, LocalizedBlogOptions } from './types';

export const createPages: GatsbyNode['createPages'] = async ({ actions, graphql }, pluginOptions: LocalizedBlogOptions) => {
  let { createPage } = actions;

  // Query blog posts
  let query: AllMarkdownRemarkQuery = await graphql(`
    query {
      allMarkdownRemark {
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

  // Create pages
  for (let edge of data.allMarkdownRemark.edges) {
    let { slug, locale, dirname } = edge.node.fields;
    let alternateUrls = alternateUrlsByDirname.get(dirname)!;
    createPage({
      path: slug,
      component: pluginOptions.blogPostTemplate,
      context: createPageContext(locale, alternateUrls, {
        slug
      })
    });
  }
};

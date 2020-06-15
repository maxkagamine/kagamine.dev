const createPageContext = require('./createPageContext');

module.exports = async ({ actions, graphql }, pluginOptions) => {
  const { createPage } = actions;

  // Query blog posts
  let { data } = await graphql(`
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

  // Match up translations
  let translationsByDirname = data.allMarkdownRemark.edges.reduce((map, edge) => {
    let { slug, locale, dirname } = edge.node.fields;
    if (!map.has(dirname)) {
      map.set(dirname, {});
    }
    map.get(dirname)[locale] = slug;
    return map;
  }, new Map());

  // Create pages
  for (let edge of data.allMarkdownRemark.edges) {
    let { slug, locale, dirname } = edge.node.fields;
    let translations = translationsByDirname.get(dirname);
    createPage({
      path: slug,
      component: pluginOptions.blogPostTemplate,
      context: createPageContext(locale, translations, {
        slug
      })
    });
  }
};

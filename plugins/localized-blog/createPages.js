const createPageContext = require('./createPageContext');

module.exports = async ({ actions, graphql }, pluginOptions) => {
  const { createPage } = actions;

  let { data } = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
              locale
            }
          }
        }
      }
    }
  `);

  for (let edge of data.allMarkdownRemark.edges) {
    let { slug, locale } = edge.node.fields;
    createPage({
      path: slug,
      component: pluginOptions.blogPostTemplate,
      context: createPageContext(locale, {
        slug
      })
    });
  }
};

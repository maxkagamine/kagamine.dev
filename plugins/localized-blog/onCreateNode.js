const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

module.exports = ({ node, getNode, actions }, pluginOptions) => {
  const { createNodeField } = actions;
  const { locales = [] } = pluginOptions;

  if (node.internal.type == 'MarkdownRemark') {
    // Get directory name and locale
    let relativeFilePath = createFilePath({ node, getNode }); // e.g. /foo/en/
    let dirname = path.dirname(relativeFilePath); // e.g. /foo
    let locale = path.basename(relativeFilePath);  // e.g. en

    // Check that locale is valid
    if (!locales.includes(locale)) {
      throw new Error(`Markdown file at ${dirname}/${locale}.md has a filename that doesn't match a site locale.`);
    }

    // Create slug with locale in front
    createNodeField({
      node,
      name: 'slug',
      value: `/${locale}${dirname}/` // e.g. /en/foo/
    });
  }
};

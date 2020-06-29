import { CreateNodeArgs } from 'gatsby';
import { createFilePath } from 'gatsby-source-filesystem';
import path from 'path';
import { LocalizedBlogOptions, MarkdownRemarkNode } from './types';

export const onCreateNode = ({ node, getNode, actions }: CreateNodeArgs<MarkdownRemarkNode>, pluginOptions: LocalizedBlogOptions) => {
  let { createNodeField } = actions;
  let { locales = [] } = pluginOptions;

  if (node.internal.type != 'MarkdownRemark') {
    return;
  }

  // Get directory name and locale
  let relativeFilePath = createFilePath({ node, getNode }); // e.g. /foo/en/
  let dirname = path.dirname(relativeFilePath); // e.g. /foo
  let locale = path.basename(relativeFilePath);  // e.g. en

  // Check that locale is valid
  if (!locales.includes(locale)) {
    throw new Error(`Markdown file at ${dirname}/${locale}.md has a filename that doesn't match a site locale.`);
  }

  // Allow overriding directory name for translated slugs
  let relativeSlug = node.frontmatter.slug ?
    `/${node.frontmatter.slug}` : dirname;

  // Create slug with locale in front
  createNodeField({
    node,
    name: 'slug',
    value: `/${locale}${relativeSlug}/` // e.g. /en/foo/
  });

  // Add locale so we don't need to parse it out when creating the page
  createNodeField({
    node,
    name: 'locale',
    value: locale
  });

  // Add dirname to be able to match up translations
  createNodeField({
    node,
    name: 'dirname',
    value: dirname
  });
};

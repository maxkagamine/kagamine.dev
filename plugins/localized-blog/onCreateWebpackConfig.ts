import { GatsbyNode } from 'gatsby';
import { ContextReplacementPlugin } from 'webpack';
import { LocalizedBlogOptions } from './types';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ actions }, pluginOptions: LocalizedBlogOptions) => {
  let { locales = [] } = pluginOptions;

  // Restricts the modules that webpack bundles in order to cover the
  // interpolated requires in wrapPageElement, courtesy of:
  // https://github.com/wiziple/gatsby-plugin-intl/blob/master/src/gatsby-node.js
  let regex = new RegExp(locales.map(l => l.split('-')[0]).join('|'));
  actions.setWebpackConfig({
    plugins: [
      new ContextReplacementPlugin(
        /@formatjs[/\\]intl-relativetimeformat[/\\]dist[/\\]locale-data$/,
        regex
      ),
      new ContextReplacementPlugin(
        /@formatjs[/\\]intl-pluralrules[/\\]dist[/\\]locale-data$/,
        regex
      )
    ]
  });
};

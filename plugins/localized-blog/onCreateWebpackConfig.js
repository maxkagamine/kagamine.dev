const webpack = require('webpack');

module.exports = ({ actions }, pluginOptions) => {
  const { locales = [] } = pluginOptions;

  // Restricts the modules that webpack bundles in order to cover the
  // interpolated requires in wrapPageElement, courtesy of:
  // https://github.com/wiziple/gatsby-plugin-intl/blob/master/src/gatsby-node.js
  let regex = new RegExp(locales.map(l => l.split('-')[0]).join('|'));
  actions.setWebpackConfig({
    plugins: [
      new webpack.ContextReplacementPlugin(
        /@formatjs[/\\]intl-relativetimeformat[/\\]dist[/\\]locale-data$/,
        regex
      ),
      new webpack.ContextReplacementPlugin(
        /@formatjs[/\\]intl-pluralrules[/\\]dist[/\\]locale-data$/,
        regex
      )
    ]
  });
};

module.exports = {
  plugins: [
    // Build
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.[jt]sx?$/
      }
    },
    'gatsby-plugin-typescript-checker',

    // App
    'material-ui-theme',

    // SSR
    'gatsby-plugin-material-ui',
    'gatsby-plugin-react-helmet'
  ]
};

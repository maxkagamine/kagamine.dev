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
    {
      resolve: 'localized-pages',
      options: {
        locales: ['en', 'ja'],
        messages: `${__dirname}/src/messages`
      }
    },
    'ascii-art',

    // SSR
    'gatsby-plugin-material-ui',
    'gatsby-plugin-react-helmet'
  ]
};

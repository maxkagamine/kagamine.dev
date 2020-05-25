module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.[jt]sx?$/
      }
    },
    'gatsby-plugin-typescript-checker',
    'gatsby-plugin-material-ui-theme',
    'gatsby-plugin-material-ui',
    'gatsby-plugin-react-helmet'
  ],
};

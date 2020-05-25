module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.[jt]sx?$/
      }
    },
    'gatsby-plugin-typescript',
    'gatsby-plugin-typescript-checker'
  ],
};

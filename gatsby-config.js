module.exports = {
  plugins: [
    // Load files in pages directory
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`
      }
    },

    // Process markdown files
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        excerpt_separator: '<!-- end -->',
        plugins: [
          // Auto smart quotes, em dashes, and ellipses
          'gatsby-remark-smartypants',

          // Add target & rel to external links
          'gatsby-remark-external-links'
        ]
      }
    },

    // Client-side routing for <a> tags in markdown posts
    'gatsby-plugin-catch-links',

    // Create localized pages & set up react-intl
    {
      resolve: 'localized-blog',
      options: {
        locales: ['en', 'ja'],
        messages: `${__dirname}/src/messages`
      }
    },

    // Configure Material-UI
    'material-ui-theme',

    // Perform linting during webpack builds
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.[jt]sx?$/
      }
    },

    // Perform type checking during webpack builds
    'gatsby-plugin-typescript-checker',

    // SSR for Material-UI's JSS styles
    'gatsby-plugin-material-ui',

    // SSR for helmet
    'gatsby-plugin-react-helmet',

    // Post-build shenanigans
    'ascii-art'
  ]
};

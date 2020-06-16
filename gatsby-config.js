module.exports = {
  siteMetadata: {
    siteUrl: 'https://kagamine.dev'
  },
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
        pedantic: false, // "pedantic" = pre-commonmark broken parsing
        plugins: [
          // Auto smart quotes, em dashes, and ellipses
          'gatsby-remark-smartypants',

          // Add target & rel to external links
          'gatsby-remark-external-links',

          // Syntax highlighting
          {
            resolve: 'gatsby-remark-vscode',
            options: {
              theme: ({ language }) => {
                if (['cs', 'csharp', 'c#'].includes(language)) {
                  return 'Default Dark+';
                }

                return 'One Dark Pro';
              },
              extensions: ['onedark-pro'],
              languageAliases: {
                shell: 'sh'
              }
            }
          },

          // Copy referenced files/media to public dir
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              ignoreFileExtensions: [] // Remove if using gatsby-remark-images
            }
          }
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
        messages: `${__dirname}/src/messages`,
        blogPostTemplate: `${__dirname}/src/pages/_blog-post.tsx`
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

    // SSR for helmet (above material-ui to put meta tags at top)
    'gatsby-plugin-react-helmet',

    // SSR for Material-UI's JSS styles
    'gatsby-plugin-material-ui',

    // Post-build shenanigans
    'ascii-art'
  ]
};

require('ts-node').register();

const LOCALES = ['en', 'ja'];

module.exports = {
  siteMetadata: {
    siteUrl: 'https://kagamine.dev',
    repoUrl: 'https://github.com/maxkagamine/kagamine.dev'
  },
  plugins: [
    // SSR for helmet (at top to put meta tags above everything else)
    'gatsby-plugin-react-helmet',

    // Not a PWA, but create a manifest anyway in the off chance someone adds
    // this to their homescreen
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        ...LOCALES.reduce((options, locale, i) => {
          let localeOptions = {
            name: require(`./src/messages/${locale}.json`).name,
            lang: locale,
            start_url: `/${locale}/`
          };
          if (i == 0) {
            Object.assign(options, localeOptions);
          } else {
            options.localize.push(localeOptions);
          }
          return options;
        }, { localize: [] }),
        display: 'standalone',
        theme_color: '#fdd002',
        background_color: '#fdd002',
        include_favicon: false, // Using round favicon for tabs
        theme_color_in_head: false,
        legacy: false,
        cache_busting_mode: 'name',
        icon: 'src/images/profile.png',
        icon_options: {
          purpose: 'maskable'
        }
      }
    },

    // Generate favicon.ico, same as manifest icon but cropped to circle
    {
      resolve: 'favicon-ico',
      options: {
        icon: 'src/images/profile.png',
        shape: 'circle'
      }
    },

    // Configure firebase & set up analytics
    {
      resolve: 'init',
      options: {
        firebase: {
          apiKey: 'AIzaSyDtssZS3bpqvZLMsKM9mBWMxvGxJ1JlQO4',
          authDomain: 'kagamine-dev.firebaseapp.com',
          databaseURL: 'https://kagamine-dev.firebaseio.com',
          projectId: 'kagamine-dev',
          storageBucket: 'kagamine-dev.appspot.com',
          messagingSenderId: '82879755365',
          appId: '1:82879755365:web:d5d51ac04d1df7fc1c428c'
          // measurementId: 'G-E3767BNKVB'
        },
        analytics: {
          measurementId: 'G-39LC601E4K'
        },
        domain: 'kagamine.dev'
      }
    },

    // Set up image preprocessing
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        useMozJpeg: true,
        defaultQuality: 80
      }
    },

    // Load files in pages & images directories
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`
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

          // Add anchors to headers
          'gatsby-remark-autolink-headers',

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
          },

          // Embed YouTube videos, tweets, etc.
          // NOTE: Using forked version of plugin due to necessary bug fixes
          {
            resolve: '@raae/gatsby-remark-oembed',
            options: {
              providers: {
                usePrefix: false,
                include: ['YouTube', 'GIPHY'] // Whitelisting as some add js to page even if not used
              }
            }
          },

          // Make YouTube embeds 100% width while maintaining aspect ratio
          'gatsby-remark-responsive-iframe'
        ]
      }
    },

    // Configure Material-UI (this comes before localized-blog so that the
    // latter will wrap it with the intl provider)
    'material-ui-theme',

    // Create localized pages & set up react-intl
    {
      resolve: 'localized-blog',
      options: {
        locales: LOCALES,
        messages: `${__dirname}/src/messages`,
        blogPostTemplate: `${__dirname}/src/pages/_blog-post.tsx`
      }
    },

    // Add cover images to blog posts
    'cover-images',

    // Client-side routing for <a> tags in markdown posts
    'gatsby-plugin-catch-links',

    // Load script for tweet buttons & twitter embeds
    'gatsby-plugin-twitter',

    // Create rss feed
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
          }
        `,
        feeds: LOCALES.map(locale => ({
          query: `
            {
              allMarkdownRemark(
                filter: { fields: { locale: { eq: "${locale}" } } },
                sort: { fields: [frontmatter___date], order: DESC }
              ) {
                edges {
                  node {
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            }
          `,
          setup({ query: { site }, ...rest }) {
            return {
              ...rest,
              site_url: `${site.siteMetadata.siteUrl}/${locale}/`
            };
          },
          serialize({ query: { site, allMarkdownRemark } }) {
            return allMarkdownRemark.edges.map(({ node }) => ({
              title: node.frontmatter.title,
              date: node.frontmatter.date,
              url: `${site.siteMetadata.siteUrl}${node.fields.slug}`
            }));
          },
          title: require(`./src/messages/${locale}.json`).name,
          output: `/${locale}/feed.xml`,
          match: `^/${locale}/`
        }))
      }
    },

    // Create sitemap
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        exclude: ['/*/404.html']
      }
    },

    // Create robots.txt (to prevent weird image results)
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: 'Googlebot-Image', disallow: '/' }]
      }
    },

    // Generate types for graphql queries
    {
      resolve: 'gatsby-plugin-typegen',
      options: {
        // Syntax highlighting & intellisense via vscode Apollo GraphQL extension
        emitSchema: {
          'src/__generated__/gatsby-introspection.json': true
        },
        emitPluginDocuments: {
          'src/__generated__/gatsby-plugin-documents.graphql': true
        }
      }
    },

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

    // Post-build shenanigans
    'ascii-art'
  ]
};

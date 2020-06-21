import { Button, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { Article } from 'schema-dts';
import { BlogPostAfterword } from '../components/BlogPostAfterword';
import { BlogPostTitle } from '../components/BlogPostTitle';
import { Layout } from '../components/Layout';
import { PageButtons } from '../components/PageButtons';
import { StructuredData } from '../components/StructuredData';
import { TableOfContents } from '../components/TableOfContents';
import profileSrc from '../images/profile.png';
import { LocalizedPageProps } from '../utils/LocalizedPageProps';

export const query = graphql`
  query BlogPostPage($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date
      }
      html
      tableOfContents
      cover {
        childImageSharp {
          fluid(maxWidth: 772) { # md breakpoint minus gutters
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`;

const STICKY_TOC_WIDTH = 250;
const CONTAINER_SPACING = 3;
const TOC_SPACING = 4;
const tocBreakpoint = (theme: Theme) =>
  `@media (min-width: ${theme.breakpoints.width('md') + ((theme.spacing(TOC_SPACING) + STICKY_TOC_WIDTH) * 2)}px)`;

const useStyles = makeStyles(theme => createStyles({
  cover: {
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    marginBottom: theme.spacing(2)
  },
  fixedToc: {
    margin: theme.spacing(2, 0),
    [tocBreakpoint(theme)]: {
      display: 'none'
    }
  },
  articleWrapper: {
    [tocBreakpoint(theme)]: {
      display: 'grid',
      gridTemplate: `'article toc' auto / ${theme.breakpoints.width('md') - theme.spacing(CONTAINER_SPACING * 2)}px ${STICKY_TOC_WIDTH}px`,
      gridColumnGap: theme.spacing(TOC_SPACING),
      marginRight: -(theme.spacing(TOC_SPACING) + STICKY_TOC_WIDTH)
    }
  },
  article: {
    gridArea: 'article'
  },
  stickyTocWrapper: {
    gridArea: 'toc',
    width: STICKY_TOC_WIDTH,
    display: 'none',
    [tocBreakpoint(theme)]: {
      display: 'block'
    }
  },
  stickyToc: {
    position: 'sticky',
    top: theme.spacing(CONTAINER_SPACING),
    maxHeight: `calc(100vh - ${theme.spacing(CONTAINER_SPACING * 2)})`
  }
}));

export default function BlogPostPage({ data, location, pageContext: { translations } }: LocalizedPageProps<GatsbyTypes.BlogPostPageQuery>) {
  const { html, frontmatter, tableOfContents, cover } = data.markdownRemark!;
  const { title, date } = frontmatter!;
  const classes = useStyles();
  const intl = useIntl();

  const siteUrl = data.site!.siteMetadata!.siteUrl;
  const coverUrl = cover ? `${siteUrl}${data.markdownRemark!.cover!.childImageSharp!.fluid!.src}` : undefined;

  return (
    <Layout location={location} translations={translations} title={title!}>
      <Helmet>
        <meta property='og:type' content='article' />
        <meta property='article:author' content={intl.formatMessage({ id: 'name' })} />
        <meta property='article:published_time' content={date} />
      </Helmet>
      {cover && (
        <Helmet>
          <meta name='twitter:card' content='summary_large_image' />
          <meta property='og:image' content={coverUrl} />
        </Helmet>
      )}
      <StructuredData<Article>
        type='Article'
        headline={title}
        datePublished={date}
        image={coverUrl}
        inLanguage={intl.locale}
        author={{
          '@type': 'Person',
          name: intl.formatMessage({ id: 'name' }),
          image: `${siteUrl}${profileSrc}`,
          url: siteUrl
        }}
        mainEntityOfPage={{
          '@type': 'WebPage',
          '@id': `${siteUrl}${translations[intl.locale]}`
        }}
      />
      <PageButtons>
        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          to={`/${intl.locale}/`}
        >
          {intl.formatMessage({ id: 'backToHomepage' })}
        </Button>
      </PageButtons>
      <div className={classes.articleWrapper}>
        <div className={classes.stickyTocWrapper}>
          {tableOfContents && (
            <TableOfContents html={tableOfContents} className={classes.stickyToc} />
          )}
        </div>
        <article className={classes.article}>
          {cover && (
            <Img
              fluid={cover.childImageSharp!.fluid}
              className={classes.cover}
              aria-hidden='true'
            />
          )}
          <BlogPostTitle title={title!} date={date!} />
          {tableOfContents && (
            <TableOfContents html={tableOfContents} className={classes.fixedToc} />
          )}
          <div dangerouslySetInnerHTML={{ __html: html! }} />
          <BlogPostAfterword />
        </article>
      </div>
    </Layout>
  );
}

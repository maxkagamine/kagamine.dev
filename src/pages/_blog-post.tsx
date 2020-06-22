import { Button, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import React from 'react';
import { useIntl } from 'react-intl';
import { BlogPostAfterword } from '../components/BlogPostAfterword';
import { BlogPostTitle } from '../components/BlogPostTitle';
import { Layout } from '../components/Layout';
import { PageButtons } from '../components/PageButtons';
import { TableOfContents } from '../components/TableOfContents';
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
  inlineToc: {
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

export default function BlogPostPage({ data, location, pageContext: { alternateUrls } }: LocalizedPageProps<GatsbyTypes.BlogPostPageQuery>) {
  const { html, frontmatter, tableOfContents, cover } = data.markdownRemark!;
  const { title, date } = frontmatter!;
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Layout
      location={location}
      alternateUrls={alternateUrls}
      metadata={{
        type: 'article',
        title,
        image: cover?.childImageSharp?.fluid?.src,
        datePublished: date!
        // TODO: description
      }}
    >
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
            <TableOfContents html={tableOfContents} className={classes.inlineToc} />
          )}
          <div dangerouslySetInnerHTML={{ __html: html! }} />
          <BlogPostAfterword />
        </article>
      </div>
    </Layout>
  );
}

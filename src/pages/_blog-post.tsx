import { Button } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { BlogPostAfterword } from '../components/BlogPostAfterword';
import { BlogPostTitle } from '../components/BlogPostTitle';
import { Layout } from '../components/Layout';
import { PageButtons } from '../components/PageButtons';
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

const useStyles = makeStyles(theme => createStyles({
  cover: {
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    marginBottom: theme.spacing(2)
  }
}));

export default function BlogPostPage({ data, location, pageContext: { translations } }: LocalizedPageProps<GatsbyTypes.BlogPostPageQuery>) {
  const { html, frontmatter, tableOfContents, cover } = data.markdownRemark!;
  const { title, date } = frontmatter!;
  const classes = useStyles();
  const intl = useIntl();

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
          <meta property='og:image' content={`${data.site!.siteMetadata!.siteUrl}${data.markdownRemark!.cover!.childImageSharp!.fluid!.src}`} />
        </Helmet>
      )}
      <PageButtons>
        <Button
          startIcon={<ArrowBackIcon />}
          component={Link}
          to={`/${intl.locale}/`}
        >
          {intl.formatMessage({ id: 'backToHomepage' })}
        </Button>
      </PageButtons>
      <article>
        {cover && (
          <Img
            fluid={cover.childImageSharp!.fluid}
            className={classes.cover}
            aria-hidden='true'
          />
        )}
        <BlogPostTitle title={title!} date={date!} />
        <div dangerouslySetInnerHTML={{ __html: html! }} />
        <BlogPostAfterword />
      </article>
    </Layout>
  );
}

import { Button } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { graphql, Link } from 'gatsby';
import React from 'react';
import { useIntl } from 'react-intl';
import { BlogPostTitle } from '../components/BlogPostTitle';
import { Layout } from '../components/Layout';
import { PageButtons } from '../components/PageButtons';
import { LocalizedPageProps } from '../utils/LocalizedPageProps';

interface BlogPostPageData {
  markdownRemark: {
    frontmatter: {
      title: string,
      date: string
    },
    html: string,
    tableOfContents: string
  };
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date
      }
      html
      tableOfContents
    }
  }
`;

const useStyles = makeStyles(theme => createStyles({

}));

export default function BlogPostPage({ data, location, pageContext: { translations } }: LocalizedPageProps<BlogPostPageData>) {
  const { html, frontmatter: { title, date }, tableOfContents } = data.markdownRemark;
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Layout location={location} translations={translations}>
      <PageButtons>
        {size => <>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            to={`/${intl.locale}/`}
            size={size}
          >
            {intl.formatMessage({ id: 'backToHomepage' })}
          </Button>
        </>}
      </PageButtons>
      <article>
        <BlogPostTitle title={title} date={date} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </Layout>
  );
}

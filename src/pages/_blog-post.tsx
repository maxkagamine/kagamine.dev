import { Button } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { graphql, Link } from 'gatsby';
import React from 'react';
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
    }
  }
`;

const useStyles = makeStyles(theme => createStyles({

}));

export default function BlogPostPage({ data, location, pageContext: { translations } }: LocalizedPageProps<GatsbyTypes.BlogPostPageQuery>) {
  const { html, frontmatter, tableOfContents } = data.markdownRemark!;
  const { title, date } = frontmatter!;
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Layout location={location} translations={translations}>
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
        <BlogPostTitle title={title!} date={date!} />
        <div dangerouslySetInnerHTML={{ __html: html! }} />
        <BlogPostAfterword />
      </article>
    </Layout>
  );
}

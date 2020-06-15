import { createStyles, makeStyles } from '@material-ui/core/styles';
import { graphql } from 'gatsby';
import React from 'react';
import { BlogPostTitle } from '../components/BlogPostTitle';
import { Layout } from '../components/Layout';
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

  return (
    <Layout location={location} translations={translations}>
      <article>
        <BlogPostTitle title={title} date={date} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </Layout>
  );
}

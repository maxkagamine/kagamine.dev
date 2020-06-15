import { createStyles, makeStyles } from '@material-ui/core/styles';
import { graphql } from 'gatsby';
import React from 'react';
import { BlogPostTitle } from '../components/BlogPostTitle/BlogPostTitle';
import { Layout } from '../components/Layout';
import { LocalizedPageProps } from '../utils/LocalizedPageProps';

interface BlogPostPageData {
  markdownRemark: {
    html: string,
    frontmatter: {
      title: string,
      date: string
    }
    tableOfContents: string
  };
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
      }
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
      <BlogPostTitle title={title} date={date} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  );
}

import { graphql } from 'gatsby';
import React from 'react';
import { BlogButtons } from '../components/BlogButtons';
import { BlogPostCard } from '../components/BlogPostCard';
import { Layout } from '../components/Layout';
import { LocalizedPageProps } from '../utils/LocalizedPageProps';

interface HomePageData {
  allMarkdownRemark: {
    edges: Array<{
      node: {
        fields: {
          slug: string
        },
        frontmatter: {
          title: string,
          date: string
        },
        excerpt: string
      }
    }>
  };
}

export const query = graphql`
  query($locale: String!) {
    allMarkdownRemark(
      filter: { fields: { locale: { eq: $locale } } },
      sort: { fields: [frontmatter___date], order: [DESC] }
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
          excerpt(format: HTML)
        }
      }
    }
  }
`;

export default function HomePage({ data, location, pageContext: { translations } }: LocalizedPageProps<HomePageData>) {
  return (
    <Layout location={location} translations={translations}>
      <BlogButtons />
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <BlogPostCard
          key={node.fields.slug}
          slug={node.fields.slug}
          title={node.frontmatter.title}
          date={node.frontmatter.date}
          excerpt={node.excerpt}
        />
      ))}
    </Layout>
  );
}

import { graphql } from 'gatsby';

export const BlogPostCover = graphql`
  fragment BlogPostCover on MarkdownRemark {
    cover {
      childImageSharp {
        fluid(maxWidth: 772) { # md breakpoint minus gutters
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;

export const BlogPostCard = graphql`
  fragment BlogPostCard on MarkdownRemark {
    fields {
      slug
    }
    frontmatter {
      title
      date
    }
    ...BlogPostCover
    lastUpdated
  }
`;

export const BlogPostCard_withExcerpt = graphql`
  fragment BlogPostCard_withExcerpt on MarkdownRemark {
    ...BlogPostCard
    excerpt(format: HTML)
  }
`;

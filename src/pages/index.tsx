import { Button, Tooltip } from '@material-ui/core';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import { graphql } from 'gatsby';
import React from 'react';
import { useIntl } from 'react-intl';
import { BlogPostCard } from '../components/BlogPostCard';
import { Layout } from '../components/Layout';
import { AlignedIconButton, PageButtons } from '../components/PageButtons';
import { LocalizedPageProps } from '../utils/LocalizedPageProps';

export const query = graphql`
  query HomePage($locale: String!) {
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
          cover {
            childImageSharp {
              fluid(maxWidth: 772) { # md breakpoint minus gutters
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          excerpt(format: HTML)
        }
      }
    }
  }
`;

export default function HomePage({ data, location, pageContext: { alternateUrls } }: LocalizedPageProps<GatsbyTypes.HomePageQuery>) {
  const intl = useIntl();

  return (
    <Layout location={location} alternateUrls={alternateUrls}>
      <PageButtons align='right' dense>
        <Tooltip title={intl.formatMessage({ id: 'notificationsTooltip' })}>
          <Button
            startIcon={<NotificationsNoneIcon />}
          >
            {intl.formatMessage({ id: 'notificationsButton' })}
          </Button>
        </Tooltip>
        <Tooltip title={intl.formatMessage({ id: 'rssFeedTooltip' })}>
          <AlignedIconButton edge='end'>
            <RssFeedIcon fontSize='inherit' />
          </AlignedIconButton>
        </Tooltip>
      </PageButtons>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <BlogPostCard
          key={node.fields!.slug!}
          slug={node.fields!.slug!}
          title={node.frontmatter!.title!}
          date={node.frontmatter!.date!}
          excerpt={node.excerpt!}
          cover={node.cover?.childImageSharp?.fluid}
        />
      ))}
    </Layout>
  );
}

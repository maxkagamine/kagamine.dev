import { Button, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import { graphql } from 'gatsby';
import React from 'react';
import { useIntl } from 'react-intl';
import { BlogPostCard } from '../components/BlogPostCard';
import { Layout } from '../components/Layout';
import { AlignedIconButton, PageControls } from '../components/PageControls';

export const query = graphql`
  query HomePage($locale: String!) {
    allMarkdownRemark(
      filter: { fields: { locale: { eq: $locale } } },
      sort: { fields: [frontmatter___date], order: DESC }
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

const useStyles = makeStyles(theme => createStyles({
  controls: {
    marginBottom: theme.spacing(1)
  }
}));

export default function HomePage({ data, location, pageContext: { alternateUrls } }: LocalizedPageProps<GatsbyTypes.HomePageQuery>) {
  const classes = useStyles();
  const intl = useIntl();

  function handleRssFeedClick() {
    window.open(`/${intl.locale}/feed.xml`);
  }

  return (
    <Layout location={location} alternateUrls={alternateUrls}>
      <PageControls className={classes.controls}>
        <PageControls.Right>
          <Tooltip title={intl.formatMessage({ id: 'notificationsTooltip' })}>
            <Button startIcon={<NotificationsNoneIcon />}>
              {intl.formatMessage({ id: 'notificationsButton' })}
            </Button>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'rssFeedTooltip' })}>
            <AlignedIconButton edge='end' onClick={handleRssFeedClick}>
              <RssFeedIcon fontSize='inherit' />
            </AlignedIconButton>
          </Tooltip>
        </PageControls.Right>
      </PageControls>
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

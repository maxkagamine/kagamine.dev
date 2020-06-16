import { Button, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import { graphql } from 'gatsby';
import React from 'react';
import { useIntl } from 'react-intl';
import { BlogPostCard } from '../components/BlogPostCard';
import { Layout } from '../components/Layout';
import { AlignedIconButton, PageButtons } from '../components/PageButtons';
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

const useStyles = makeStyles(theme => createStyles({
  notificationsButton: {
    lineHeight: theme.typography.pxToRem(23) // Fix alignment
  },
  notificationsTooltip: {
    maxWidth: 'none'
  }
}));

export default function HomePage({ data, location, pageContext: { translations } }: LocalizedPageProps<HomePageData>) {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Layout location={location} translations={translations}>
      <PageButtons align='right' dense>
        {size => <>
          <Tooltip
            title={intl.formatMessage({ id: 'notificationsTooltip' })}
            classes={{ tooltip: classes.notificationsTooltip }}
          >
            <Button
              startIcon={<NotificationsNoneIcon />}
              className={classes.notificationsButton}
              size={size}
            >
              {intl.formatMessage({ id: 'notificationsButton' })}
            </Button>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'rssFeedTooltip' })}>
            <AlignedIconButton
              edge='end'
              size={size}
            >
              <RssFeedIcon fontSize='inherit' />
            </AlignedIconButton>
          </Tooltip>
        </>}
      </PageButtons>
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

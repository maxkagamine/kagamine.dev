import { Button, Theme, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import React from 'react';
import { useIntl } from 'react-intl';
import { LocalizedPageProps } from '../../plugins/localized-blog';
import { BlogPostAfterword } from '../components/BlogPostAfterword';
import { BlogPostCard } from '../components/BlogPostCard';
import { BlogPostTitle } from '../components/BlogPostTitle';
import { Layout } from '../components/Layout';
import { AlignedIconButton, PageControls } from '../components/PageControls';
import { CopyLinkShareTarget, HackerNewsShareTarget, LineShareTarget, LinkedInShareTarget, RedditShareTarget, ShareButton, TwitterShareTarget } from '../components/ShareButton';
import { TableOfContents } from '../components/TableOfContents';

export const query = graphql`
  query BlogPostPage($slug: String!, $previous: String, $next: String) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date
      }
      html
      excerptPlain: excerpt(format: PLAIN)
      tableOfContents
      ...BlogPostCover
      parent {
        ... on File {
          relativePath
        }
      }
      lastUpdated
    }
    previous: markdownRemark(fields: { slug: { eq: $previous } }) {
      ...BlogPostCard
    }
    next: markdownRemark(fields: { slug: { eq: $next } }) {
      ...BlogPostCard
    }
    site {
      siteMetadata {
        repoUrl
      }
    }
  }
`;

const STICKY_TOC_WIDTH = 250;
const CONTAINER_SPACING = 3;
const TOC_SPACING = 4;
const tocBreakpoint = (theme: Theme) =>
  `@media (min-width: ${theme.breakpoints.width('md') + ((theme.spacing(TOC_SPACING) + STICKY_TOC_WIDTH) * 2)}px)`;

const useStyles = makeStyles(theme => createStyles({
  cover: {
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    marginBottom: theme.spacing(2)
  },
  inlineToc: {
    margin: theme.spacing(2, 0),
    [tocBreakpoint(theme)]: {
      display: 'none'
    }
  },
  articleWrapper: {
    [tocBreakpoint(theme)]: {
      display: 'grid',
      gridTemplate: `'article toc' auto / ${theme.breakpoints.width('md') - theme.spacing(CONTAINER_SPACING * 2)}px ${STICKY_TOC_WIDTH}px`,
      gridColumnGap: theme.spacing(TOC_SPACING),
      marginRight: -(theme.spacing(TOC_SPACING) + STICKY_TOC_WIDTH)
    }
  },
  article: {
    gridArea: 'article'
  },
  stickyTocWrapper: {
    gridArea: 'toc',
    width: STICKY_TOC_WIDTH,
    display: 'none',
    [tocBreakpoint(theme)]: {
      display: 'block'
    }
  },
  stickyToc: {
    position: 'sticky',
    top: theme.spacing(CONTAINER_SPACING),
    maxHeight: `calc(100vh - ${theme.spacing(CONTAINER_SPACING * 2)})`
  },
  prevNext: {
    display: 'grid',
    gridGap: theme.spacing(2),
    marginTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      gridAutoColumns: '1fr',
      gridAutoFlow: 'column',
      alignItems: 'start'
    }
  },
  card: {
    '$prevNext & + &': {
      marginTop: 0
    }
  }
}));

export default function BlogPostPage({ data, location, pageContext: { alternateUrls } }: LocalizedPageProps<GatsbyTypes.BlogPostPageQuery>) {
  const { html, excerptPlain, tableOfContents, cover, lastUpdated } = data.markdownRemark!;
  const { title, date } = data.markdownRemark!.frontmatter!;
  const { relativePath } = data.markdownRemark!.parent! as Pick<GatsbyTypes.File, 'relativePath'>;
  const { previous, next } = data;
  const { repoUrl } = data.site!.siteMetadata!;
  const classes = useStyles();
  const intl = useIntl();

  let editUrl = `${repoUrl}/edit/master/src/pages/${relativePath}`;
  let issueUrl = `${repoUrl}/issues/new`;

  function handleEditClick() {
    window.open(editUrl, '', 'noreferrer');
  }

  return (
    <Layout
      location={location}
      alternateUrls={alternateUrls}
      metadata={{
        type: 'article',
        title,
        image: cover?.childImageSharp?.fluid?.src,
        datePublished: date!,
        dateUpdated: lastUpdated,
        description: excerptPlain
      }}
    >
      <PageControls>
        <PageControls.Left>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            to={`/${intl.locale}/`}
          >
            {intl.formatMessage({ id: 'backToHomepage' })}
          </Button>
        </PageControls.Left>
        <PageControls.Right>
          <Tooltip title={intl.formatMessage({ id: 'editPageTooltip' })}>
            <AlignedIconButton onClick={handleEditClick}>
              <EditIcon fontSize='inherit' />
            </AlignedIconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'shareTooltip' })}>
            <ShareButton edge='end'>
              <TwitterShareTarget via='maxkagamine'>{intl.formatMessage({ id: 'shareTwitter' })}</TwitterShareTarget>
              <RedditShareTarget />
              <LineShareTarget>{intl.formatMessage({ id: 'shareLine' })}</LineShareTarget>
              <LinkedInShareTarget />
              <HackerNewsShareTarget />
              <CopyLinkShareTarget>{intl.formatMessage({ id: 'shareCopy' })}</CopyLinkShareTarget>
            </ShareButton>
          </Tooltip>
        </PageControls.Right>
      </PageControls>
      <div className={classes.articleWrapper}>
        <div className={classes.stickyTocWrapper}>
          {tableOfContents && (
            <TableOfContents html={tableOfContents} className={classes.stickyToc} />
          )}
        </div>
        <article className={classes.article}>
          {cover && (
            <Img
              fluid={cover.childImageSharp!.fluid}
              className={classes.cover}
              aria-hidden='true'
            />
          )}
          <BlogPostTitle title={title!} date={date!} lastUpdated={lastUpdated} />
          {tableOfContents && (
            <TableOfContents html={tableOfContents} className={classes.inlineToc} />
          )}
          <div dangerouslySetInnerHTML={{ __html: html! }} />
          <BlogPostAfterword editUrl={editUrl} issueUrl={issueUrl} />
        </article>
      </div>
      {(previous || next) && (
        <nav className={classes.prevNext} data-nosnippet>
          {previous && (
            <BlogPostCard
              key={previous.fields!.slug!}
              slug={previous.fields!.slug!}
              title={previous.frontmatter!.title!}
              date={previous.frontmatter!.date!}
              cover={previous.cover?.childImageSharp?.fluid}
              lastUpdated={previous.lastUpdated}
              className={classes.card}
            />
          )}
          {next && (
            <BlogPostCard
              key={next.fields!.slug!}
              slug={next.fields!.slug!}
              title={next.frontmatter!.title!}
              date={next.frontmatter!.date!}
              cover={next.cover?.childImageSharp?.fluid}
              lastUpdated={next.lastUpdated}
              className={classes.card}
            />
          )}
        </nav>
      )}
    </Layout>
  );
}

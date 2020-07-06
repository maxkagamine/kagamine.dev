import { Card, CardActionArea, CardContent, CardMedia } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Link } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import React from 'react';
import { BlogPostTitle } from '../BlogPostTitle';
import { ReadMoreButton } from './ReadMoreButton';

interface BlogPostCardProps {
  /**
   * The post slug.
   */
  slug: string;

  /**
   * The post title.
   */
  title: string;

  /**
   * The post date as an ISO 8601 string.
   */
  date: string;

  /**
   * The excerpt html.
   */
  excerpt?: string;

  /**
   * Optional cover image. Should use the same max width as blog post pages
   * despite the border to avoid creating two images for the user to download.
   */
  cover?: FluidObject;

  /**
   * The post's last updated date as an ISO 8601 string.
   */
  lastUpdated?: string;

  className?: string;
}

const useStyles = makeStyles(theme => createStyles({
  root: {
    '& + &': {
      marginTop: theme.spacing(3)
    },
    [theme.breakpoints.down('xs')]: { // Remove card borders on mobile
      borderLeft: 'none',
      borderRight: 'none',
      borderRadius: 0,
      marginLeft: -theme.spacing(2),
      marginRight: -theme.spacing(2),
      '& + &': {
        marginTop: 0,
        borderTop: 'none'
      }
    }
  },
  content: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    },
    [theme.breakpoints.down('xs')]: { // Counteract negative margin
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4)
    }
  },
  excerpt: {
    pointerEvents: 'none'
  },
  excerptLink: {
    color: theme.palette.secondary.main
  }
}));

export function BlogPostCard(props: BlogPostCardProps) {
  const { slug, title, date, excerpt, cover, lastUpdated, className } = props;
  const classes = useStyles(props);

  // Nested link causes visual glitch on page load as DOM gets confused
  let excerptWithoutLinks = excerpt
    ?.replace(/<a /g, `<span class="${classes.excerptLink}" `)
     .replace(/<\/a>/g, '</span>');

  return (
    <Card component='article' className={clsx(classes.root, className)}>
      <CardActionArea component={Link} to={slug} role='link'>
        {cover && (
          <CardMedia component={Img} fluid={cover} aria-hidden='true' />
        )}
        <CardContent className={classes.content}>
          <BlogPostTitle title={title} date={date} lastUpdated={lastUpdated} />
          {excerptWithoutLinks && (
            <div dangerouslySetInnerHTML={{ __html: excerptWithoutLinks }} className={classes.excerpt} />
          )}
          <ReadMoreButton />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

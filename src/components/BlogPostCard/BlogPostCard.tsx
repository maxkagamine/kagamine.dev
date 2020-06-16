import { Card, CardActionArea, CardContent } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';
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
  excerpt: string;
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
  }
}));

export function BlogPostCard(props: BlogPostCardProps) {
  const { slug, title, date, excerpt } = props;
  const classes = useStyles(props);

  return (
    <Card component='article' className={classes.root}>
      <CardActionArea component={Link} to={slug} role='link'>
        <CardContent className={classes.content}>
          <BlogPostTitle title={title} date={date} />
          <div dangerouslySetInnerHTML={{ __html: excerpt }} className={classes.excerpt} />
          <ReadMoreButton />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

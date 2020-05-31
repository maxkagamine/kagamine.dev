import { Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';
import React from 'react';

interface BlogPostCardProps {
  // TODO
}

const useStyles = makeStyles(theme => createStyles({
  content: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2)
    }
  }
}));

export function BlogPostCard(props: BlogPostCardProps) {
  const classes = useStyles(props);

  return (
    <Card component='article' variant='outlined'>
      <CardActionArea component={Link} to='#' role='link'>
        <CardContent className={classes.content}>
          <header>
            <Typography variant='h1'>
              Blog title here
            </Typography>
            <Typography variant='subtitle1'>
              1 year ago &middot; Updated 4 days ago
            </Typography>
          </header>
          <p>Blog post here</p>
          <h2>Header 2</h2>
          <p>Blog post here</p>
          <h3>Header 3</h3>
          <p>Blog post here</p>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

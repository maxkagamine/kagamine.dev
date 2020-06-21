import { Tooltip, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useIntl } from 'react-intl';
import { useTimeAgo } from '../../utils/useTimeAgo';

interface BlogPostTitleProps {
  /**
   * The post title.
   */
  title: string;

  /**
   * The post date as an ISO 8601 string.
   */
  date: string;
}

const useStyles = makeStyles(theme => createStyles({
  subtitle: {
    marginTop: theme.spacing(1)
  }
}));

export function BlogPostTitle(props: BlogPostTitleProps) {
  const { title, date } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const timeAgo = useTimeAgo();

  return (
    <header>
      <Typography variant='h1'>
        {title}
      </Typography>
      <Typography variant='subtitle1' component='div' className={classes.subtitle}>
        <Tooltip title={intl.formatDate(date, { year: 'numeric', month: 'long', day: 'numeric' })}>
          <time dateTime={date}>
            {timeAgo(date)}
          </time>
        </Tooltip>
      </Typography>
    </header>
  );
}

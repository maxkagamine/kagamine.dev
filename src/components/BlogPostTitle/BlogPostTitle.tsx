import { Tooltip, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { FormatDateOptions, useIntl } from 'react-intl';
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

  /**
   * The post's last updated date as an ISO 8601 string.
   */
  lastUpdated?: string;
}

const useStyles = makeStyles(theme => createStyles({
  subtitle: {
    marginTop: theme.spacing(1)
  },
  separator: {
    margin: '0 0.25em'
  }
}));

export function BlogPostTitle(props: BlogPostTitleProps) {
  const { title, date, lastUpdated } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const timeAgo = useTimeAgo();

  let tooltipFormat: FormatDateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <header>
      <Typography variant='h1'>
        {title}
      </Typography>
      <Typography variant='subtitle1' component='div' className={classes.subtitle}>
        <Tooltip title={intl.formatDate(date, tooltipFormat)}>
          <time dateTime={date}>
            {timeAgo(date)}
          </time>
        </Tooltip>
        {lastUpdated && <>
          <span className={classes.separator}>・</span>
          <Tooltip title={intl.formatDate(lastUpdated, tooltipFormat)}>
            <time dateTime={lastUpdated}>
              {intl.formatMessage({ id: 'lastUpdated' }, {
                timeAgo: timeAgo(lastUpdated)
              })}
            </time>
          </Tooltip>
        </>}
      </Typography>
    </header>
  );
}

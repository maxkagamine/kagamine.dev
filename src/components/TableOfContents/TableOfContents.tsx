import { Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { useIntl } from 'react-intl';

/*
  Remark's generated HTML looks like this:

  <ul>
    <li><a href="">h2</a></li>
    <li>
      <p><a href="">h2</a></p>
      <ul>
        <li><a href="">h3</a></li>
        <li><a href="">h3</a></li>
      </ul>
    </li>
  </ul>
*/

interface TableOfContentsProps {
  /**
   * The table of contents html from remark.
   */
  html: string;

  [key: string]: any;
}

const useStyles = makeStyles(theme => createStyles({
  root: {
    padding: theme.spacing(1.5, 1, 1.5, 2),
    borderLeft: `4px solid ${theme.palette.primary.main}`, // Match header underline
    '& ul': {
      listStyle: 'none',
      padding: 0
    }
  },
  header: {
    lineHeight: 1,
    cursor: 'default'
  },
  topLevel: {
    ...theme.typography.subtitle1,
    margin: theme.spacing(1.5, 0, 0),
    '& ul': {
      margin: theme.spacing(0, 0, 0, 2)
    },
    '& p': {
      margin: 0
    },
    '& a': {
      display: 'inline-block',
      padding: '0.25em 0',
      '&:not(:hover)': {
        color: 'inherit'
      }
    },
    '& > li:last-child': {
      marginBottom: '-0.35em' // Adjust for line height & padding
    }
  }
}));

export function TableOfContents(props: TableOfContentsProps) {
  const { html, className, ...rest } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <nav {...rest} className={clsx(classes.root, className)}>
      <Typography variant='overline' component='div' className={classes.header}>
        {intl.formatMessage({ id: 'contents' })}
      </Typography>
      <ul
        className={classes.topLevel}
        dangerouslySetInnerHTML={{ __html: html.replace(/^<ul>|<\/ul>$/g, '') }}
      />
    </nav>
  );
}

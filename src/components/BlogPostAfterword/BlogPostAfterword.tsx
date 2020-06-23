import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useIntl } from 'react-intl';

interface BlogPostAfterwordProps {
  /**
   * A link to edit this post on GitHub.
   */
  editUrl: string;

  /**
   * A link to create an issue on GitHub.
   */
  issueUrl: string;
}

const useStyles = makeStyles(theme => createStyles({
  root: {
    '& .twitter-share-button': {
      verticalAlign: 'middle',
      top: -2,
      position: 'relative !important',
      margin: '0 0.1em'
    }
  }
}));

export function BlogPostAfterword(props: BlogPostAfterwordProps) {
  const { editUrl, issueUrl } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  let blogPostAfterword3 = intl.formatMessage({ id: 'blogPostAfterword3' });

  return (
    <div className={classes.root}>
      <h2>{intl.formatMessage({ id: 'blogPostAfterwordTitle' })}</h2>
      <p>
        {intl.formatMessage({ id: 'blogPostAfterword1' }, {
          tweet: <a href='https://twitter.com/intent/tweet' className='twitter-share-button' data-size='large' key='tweet'>Tweet</a>,
          me: <a href='https://twitter.com/maxkagamine' rel='noopener noreferrer' key='me'>@maxkagamine</a>
        })}
      </p>
      <p>
        {intl.formatMessage({ id: 'blogPostAfterword2' }, {
          editLink: str => <a href={editUrl} rel='noopener noreferrer' key='editLink'>{str}</a>,
          issueLink: str => <a href={issueUrl} rel='noopener noreferrer' key='issueLink'>{str}</a>
        })}
      </p>
      {blogPostAfterword3 && <p>{blogPostAfterword3}</p>}
    </div>
  );
}

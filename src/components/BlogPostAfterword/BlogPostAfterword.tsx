import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useRef, useState } from 'react';
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
  const tweetRef = useRef<HTMLAnchorElement>(null);
  const [tweetButtonBlocked, setTweetButtonBlocked] = useState(false);

  useEffect(() => {
    // uBlock by default won't break twitter buttons, but it may if the user
    // enables more aggressive social blocking lists
    if (tweetRef.current && getComputedStyle(tweetRef.current).display == 'none') {
      setTweetButtonBlocked(true);
    }
  }, [tweetRef]);

  let blogPostAfterword3 = intl.formatMessage({ id: 'blogPostAfterword3' });

  return (
    <div className={classes.root} data-nosnippet>
      <h2>{intl.formatMessage({ id: 'blogPostAfterwordTitle' })}</h2>
      <p>
        {intl.formatMessage({ id: 'blogPostAfterword1' }, {
          tweet: str => tweetButtonBlocked ? str : (
            <a
              href='https://twitter.com/intent/tweet'
              className='twitter-share-button'
              data-size='large'
              key='tweet'
              ref={tweetRef}
            >
              {str}
            </a>
          ),
          me: <a href='https://twitter.com/maxkagamine' target='_blank' rel='noopener noreferrer' key='me'>@maxkagamine</a>
        })}
      </p>
      <p>
        {intl.formatMessage({ id: 'blogPostAfterword2' }, {
          editLink: str => <a href={editUrl} target='_blank' rel='noopener noreferrer' key='editLink'>{str}</a>,
          issueLink: str => <a href={issueUrl} target='_blank' rel='noopener noreferrer' key='issueLink'>{str}</a>
        })}
      </p>
      {blogPostAfterword3 && <p>{blogPostAfterword3}</p>}
    </div>
  );
}

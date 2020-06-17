import { createStyles, makeStyles } from '@material-ui/core/styles';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { useIntl } from 'react-intl';

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

export function BlogPostAfterword(props: {}) {
  const classes = useStyles(props);
  const intl = useIntl();
  const data = useStaticQuery<GatsbyTypes.BlogPostAfterwordQuery>(graphql`
    query BlogPostAfterword {
      site {
        siteMetadata {
          repoUrl
        }
      }
    }
  `);

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
          editLink: str => <span key='editLink'>{str}</span>, // TODO: GitHub edit links
          issueLink: str => (
            <a href={`${data.site!.siteMetadata!.repoUrl}/issues/new`} rel='noopener noreferrer' key='issueLink'>
              {str}
            </a>
          )
        })}
      </p>
      {blogPostAfterword3 && <p>{blogPostAfterword3}</p>}
    </div>
  );
}

import { ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';

/**
 * ShareData with `text` and `url` required.
 */
export type ShareButtonData = Required<Pick<ShareData, 'text' | 'url'>> & ShareData;

export interface ShareTargetProps {
  /**
   * The share target's url template with {title} and {url} placeholders.
   */
  url?: string;

  /**
   * The share target's domain, for showing a favicon, if different from url.
   */
  domain?: string;

  /**
   * A function that returns the data to be shared. Automatically passed down
   * from ShareButton.
   */
  getShareData?: () => ShareButtonData;

  /**
   * Custom icon, overriding the favicon.
   */
  icon?: React.ReactNode;

  /**
   * Custom click handler, overriding the share url.
   */
  onClick?: (data: ShareButtonData) => void;

  /**
   * The share target name to display in the list item.
   */
  children?: React.ReactNode;
}

const useStyles = makeStyles(theme => createStyles({
  shareTargetIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
    fontSize: 16 // Match favicons if svg icon
  },
  favicon: {
    position: 'relative',
    top: -1
  }
}));

export const ShareTarget = React.forwardRef<HTMLLIElement, ShareTargetProps>((props, ref) => {
  const { url: shareUrlTemplate, domain, getShareData, icon, onClick, children } = props;
  const classes = useStyles(props);

  let faviconDomain = domain ?? (shareUrlTemplate ? new URL(shareUrlTemplate).hostname : '');

  function handleOpenShareUrl(data: ShareButtonData) {
    if (!shareUrlTemplate) {
      return;
    }
    let shareUrl = shareUrlTemplate
      .replace('{url}', encodeURIComponent(data.url))
      .replace('{title}', encodeURIComponent(data.text));
    window.open(shareUrl, '', 'noreferrer');
  }

  function handleClick() {
    let shareData = getShareData?.();
    if (!shareData) {
      return;
    }
    if (onClick) {
      onClick(shareData);
    } else {
      handleOpenShareUrl(shareData);
    }
  }

  return (
    <MenuItem onClick={handleClick} ref={ref}>
      <ListItemIcon className={classes.shareTargetIcon}>
        {icon || (
          <img
            src={`https://www.google.com/s2/favicons?domain=${faviconDomain}`}
            alt=''
            className={classes.favicon}
          />
        )}
      </ListItemIcon>
      <ListItemText primary={children} />
    </MenuItem>
  );
});

ShareTarget.displayName = 'ShareTarget';

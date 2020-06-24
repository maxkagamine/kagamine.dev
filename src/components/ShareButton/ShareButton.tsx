import { IconButtonProps, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import ShareIcon from '@material-ui/icons/Share';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { AlignedIconButton } from '../PageControls';

const SHARE_TARGETS = [
  { messageId: 'shareTwitter', domain: 'twitter.com', urlTemplate: 'https://twitter.com/intent/tweet?text={title}&url={url}&via=maxkagamine' },
  { messageId: 'shareReddit', domain: 'reddit.com', urlTemplate: 'https://www.reddit.com/submit?title={title}&url={url}' },
  { messageId: 'shareLine', domain: 'line.me', urlTemplate: 'https://social-plugins.line.me/lineit/share?url={url}' },
  { messageId: 'shareLinkedIn', domain: 'linkedin.com', urlTemplate: 'https://www.linkedin.com/sharing/share-offsite/?url={url}' },
  { messageId: 'shareHackerNews', domain: 'news.ycombinator.com', urlTemplate: 'https://news.ycombinator.com/submitlink?u={url}&t={title}' }
];

interface ShareButtonProps extends Omit<IconButtonProps, 'children' | 'ref'>
{ }

const useStyles = makeStyles(theme => createStyles({
  shareTargetIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(2)
  },
  favicon: {
    position: 'relative',
    top: -1
  },
  copyIcon: {
    fontSize: 16 // Match favicons
  }
}));

export const ShareButton = React.forwardRef<HTMLDivElement, ShareButtonProps>((props, ref) => {
  const classes = useStyles(props);
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  function getShareData(): Required<Pick<ShareData, 'text' | 'url'>> {
    return {
      text: document.title,
      url: document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? document.location.href
    };
  }

  function handleClick(event: React.MouseEvent) {
    if (navigator.share !== undefined) {
      navigator.share(getShareData());
      return;
    }

    // Fall back to dropdown menu
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleShare(urlTemplate: string) {
    let { url, text } = getShareData();
    let shareUrl = urlTemplate
      .replace('{url}', encodeURIComponent(url))
      .replace('{title}', encodeURIComponent(text));
    window.open(shareUrl, '', 'noreferrer');
    handleClose();
  }

  function handleCopy() {
    let { url } = getShareData();
    navigator.clipboard?.writeText(url);
    handleClose();
  }

  return <>
    <AlignedIconButton
      {...props}
      ref={ref}
      aria-controls='share-menu'
      aria-haspopup='true'
      onClick={handleClick}
    >
      <ShareIcon fontSize='inherit' />
    </AlignedIconButton>
    <Menu
      id='share-menu'
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      getContentAnchorEl={null}
      open={!!anchorEl}
      onClose={handleClose}
      keepMounted // Preload icons
    >
      {SHARE_TARGETS.map(({ messageId, domain, urlTemplate }) => (
        <MenuItem onClick={() => handleShare(urlTemplate)}>
          <ListItemIcon className={classes.shareTargetIcon}>
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}`}
              alt=''
              className={classes.favicon}
            />
          </ListItemIcon>
          <ListItemText primary={intl.formatMessage({ id: messageId })} />
        </MenuItem>
      ))}
      <MenuItem onClick={handleCopy}>
        {/* TODO: Next version of Material-UI will have ContentCopy icon */}
        <ListItemIcon className={classes.shareTargetIcon}>
          <LinkIcon className={classes.copyIcon} />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'shareCopy' })} />
      </MenuItem>
    </Menu>
  </>;
});

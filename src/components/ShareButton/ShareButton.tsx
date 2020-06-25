import { IconButtonProps, Menu } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import React, { useState } from 'react';
import { AlignedIconButton } from '../PageControls';
import { ShareButtonData } from './ShareTarget';

interface ShareButtonProps extends Omit<IconButtonProps, 'children' | 'ref'>
{
  /**
   * A function that returns the data to be shared. Defaults to `document.title`
   * and either canonical url or `document.location`.
   */
  getShareData?: () => ShareButtonData;

  /**
   * Fallback share targets.
   */
  children: React.ReactElement | React.ReactElement[];
}

function getDefaultShareData(): ShareButtonData {
  return {
    text: document.title,
    url: document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? document.location.href
  };
}

let nextId = 0;

export const ShareButton = React.forwardRef<HTMLDivElement, ShareButtonProps>((props, ref) => {
  const { children, getShareData = getDefaultShareData, ...rest } = props;
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [id] = useState(() => `ShareButton_${nextId++}`);

  const shareTargets = React.Children.map(children, (c: React.ReactElement) =>
    c && c.props.getShareData == null ? React.cloneElement(c, { getShareData }) : c);

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

  return <>
    <AlignedIconButton
      {...rest}
      ref={ref}
      aria-controls={id}
      aria-haspopup='true'
      onClick={handleClick}
    >
      <ShareIcon fontSize='inherit' />
    </AlignedIconButton>
    <Menu
      id={id}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      getContentAnchorEl={null}
      open={!!anchorEl}
      onClose={handleClose}
      onClick={handleClose}
      keepMounted // Preload icons
    >
      {shareTargets}
    </Menu>
  </>;
});

ShareButton.displayName = 'ShareButton';

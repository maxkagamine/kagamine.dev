import ContentCopyIcon from '@material-ui/icons/ContentCopy';
import React from 'react';
import { ShareButtonData, ShareTarget, ShareTargetProps } from './ShareTarget';

export function CopyLinkShareTarget(props: ShareTargetProps) {
  function handleClick(data: ShareButtonData) {
    navigator.clipboard?.writeText(data.url);
  }

  return (
    <ShareTarget
      icon={<ContentCopyIcon fontSize='inherit' />}
      onClick={handleClick}
      {...props}
    ></ShareTarget>
  );
}

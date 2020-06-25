import LinkIcon from '@material-ui/icons/Link';
import React from 'react';
import { ShareButtonData, ShareTarget, ShareTargetProps } from './ShareTarget';

export function CopyLinkShareTarget(props: ShareTargetProps) {
  function handleClick(data: ShareButtonData) {
    navigator.clipboard?.writeText(data.url);
  }

  // TODO: Next version of Material-UI will have ContentCopy icon
  return (
    <ShareTarget
      icon={<LinkIcon fontSize='inherit' />}
      onClick={handleClick}
      {...props}
    ></ShareTarget>
  );
}

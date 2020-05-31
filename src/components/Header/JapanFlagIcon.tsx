import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';

export function JapanFlagIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 27 27'>
      <circle fill='#FFFFFF' cx='13.5' cy='13.5' r='13.5' />
      <circle fill='#BC002D' cx='13.5' cy='13.5' r='5.5' />
    </SvgIcon>
  );
}

import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';

// Font Awesome
export function MusicIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 384 448'>
      <path d='M384 56v280c0 35.25-52.75 48-80 48s-80-12.75-80-48 52.75-48 80-48c16.5 0 33 3 48 9.75v-134.25l-192 59.25v177.25c0 35.25-52.75 48-80 48s-80-12.75-80-48 52.75-48 80-48c16.5 0 33 3 48 9.75v-241.75c0-10.5 7-19.75 17-23l208-64c2.25-0.75 4.5-1 7-1 13.25 0 24 10.75 24 24z'></path>
    </SvgIcon>
  );
}

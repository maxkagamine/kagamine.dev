import { RenderBodyArgs, withAssetPrefix } from 'gatsby';
import React from 'react';
import { InternalFaviconIcoOptions } from './types';

export const onRenderBody = ({ setHeadComponents }: RenderBodyArgs, pluginOptions: InternalFaviconIcoOptions) => {
  let { hash, sizes = [16, 32] /* create-ico default */ } = pluginOptions;

  setHeadComponents([
    <link
      key='favicon-ico'
      rel='icon'
      sizes={sizes.map(s => `${s}x${s}`).join(' ')}
      href={withAssetPrefix(`favicon.ico?${hash}`)}
    />
  ]);
};

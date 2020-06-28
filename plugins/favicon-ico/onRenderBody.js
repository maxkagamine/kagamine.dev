import { withAssetPrefix } from 'gatsby';
import React from 'react';

export const onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const { __hash, sizes = [16, 32] /* create-ico default */ } = pluginOptions;

  setHeadComponents([
    <link
      key='favicon-ico'
      rel='icon'
      sizes={sizes.map(s => `${s}x${s}`).join(' ')}
      href={withAssetPrefix(`favicon.ico?${__hash}`)}
    />
  ]);
};

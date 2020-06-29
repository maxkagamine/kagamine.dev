import { promises as fs } from 'fs';
import { NodePluginArgs } from 'gatsby';
import { InternalFaviconIcoOptions } from './types';

export const onPreInit = async ({ createContentDigest }: NodePluginArgs, pluginOptions: InternalFaviconIcoOptions) => {
  // Store hash for onRenderBody, same as gatsby-plugin-manifest
  let sourceImage = await fs.readFile(pluginOptions.icon);
  pluginOptions.hash = createContentDigest(sourceImage);
};

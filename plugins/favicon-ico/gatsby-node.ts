import { createIco } from 'create-ico';
import { promises as fs } from 'fs';
import { NodePluginArgs, ParentSpanPluginArgs } from 'gatsby';
import { FaviconIcoOptions, InternalFaviconIcoOptions } from './types';

export const onPreInit = async ({ createContentDigest }: NodePluginArgs, pluginOptions: InternalFaviconIcoOptions) => {
  // Store hash for onRenderBody, same as gatsby-plugin-manifest
  let sourceImage = await fs.readFile(pluginOptions.icon);
  pluginOptions.hash = createContentDigest(sourceImage);
};

export const onPostBootstrap = async ({ reporter, parentSpan }: ParentSpanPluginArgs, pluginOptions: FaviconIcoOptions) => {
  let { icon, ...createIcoOptions } = pluginOptions;

  let activity = reporter.activityTimer('Create favicon.ico', { parentSpan: parentSpan as any });
  activity.start();

  await createIco(icon, 'public/favicon.ico', createIcoOptions);

  activity.end();
};

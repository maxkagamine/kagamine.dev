import { createIco } from 'create-ico';
import { ParentSpanPluginArgs } from 'gatsby';
import { FaviconIcoOptions } from './types';

export const onPostBootstrap = async ({ reporter, parentSpan }: ParentSpanPluginArgs, pluginOptions: FaviconIcoOptions) => {
  let { icon, ...createIcoOptions } = pluginOptions;

  let activity = reporter.activityTimer('Create favicon.ico', { parentSpan: parentSpan as any });
  activity.start();

  await createIco(icon, 'public/favicon.ico', createIcoOptions);

  activity.end();
};

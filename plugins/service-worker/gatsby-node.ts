import { ParentSpanPluginArgs } from 'gatsby';
import path from 'path';
import webpack, { Configuration } from 'webpack';

interface ServiceWorkerPluginOptions {
  entry: string;
  output?: string;
}

export const onPostBuild = async ({ reporter, parentSpan, store }: ParentSpanPluginArgs, pluginOptions: ServiceWorkerPluginOptions) => {
  let basename = path.basename(pluginOptions.entry);
  let activity = reporter.activityTimer(`Compiling ${basename}`, { parentSpan: parentSpan as any });
  activity.start();

  let gatsbyConfig = store.getState().webpack;
  let config: Configuration = {
    ...gatsbyConfig,
    entry: pluginOptions.entry,
    output: {
      path: path.join(gatsbyConfig.context, 'public'),
      filename: pluginOptions.output ?? basename.replace(/\.ts$/, '.js')
    },
    target: 'web',
    mode: 'production',
    optimization: undefined,
    externals: undefined
  };

  await new Promise((resolve, reject) => {
    webpack(config).run((err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.hasErrors()) {
        reject(stats.toString());
      } else {
        resolve();
      }
    });
  });

  activity.end();
};

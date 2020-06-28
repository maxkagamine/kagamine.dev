const { createIco } = require('create-ico');

module.exports = async ({ reporter, parentSpan }, pluginOptions) => {
  const { icon, ...createIcoOptions } = pluginOptions;

  let activity = reporter.activityTimer('Create favicon.ico', { parentSpan });
  activity.start();

  await createIco(icon, 'public/favicon.ico', createIcoOptions);

  activity.end();
};

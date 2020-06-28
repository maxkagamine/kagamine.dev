const fs = require('fs').promises;

module.exports = async ({ createContentDigest }, pluginOptions) => {
  // Store hash for onRenderBody, same as gatsby-plugin-manifest
  let sourceImage = await fs.readFile(pluginOptions.icon);
  pluginOptions.__hash = createContentDigest(sourceImage);
};

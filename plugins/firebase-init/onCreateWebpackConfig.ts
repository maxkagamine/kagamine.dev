import { GatsbyNode } from 'gatsby';
import { ExternalsElement } from 'webpack';

const REGEX = /^@?firebase(\/(.+))?/;

// https://github.com/gatsbyjs/gatsby/issues/17725#issuecomment-614354844
// https://github.com/firebase/firebase-js-sdk/issues/2222#issuecomment-538072948
export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ stage, actions, getConfig }) => {
  if (stage == 'build-html') {
    actions.setWebpackConfig({
      externals: (getConfig().externals as ExternalsElement[]).concat((context, request, callback) => {
        if (REGEX.test(request)) {
          callback(null, `umd ${request}`);
        } else {
          callback();
        }
      })
    });
  }
};

import { RenderBodyArgs } from 'gatsby';
import React from 'react';
import { InitOptions } from './types';

function script(js: string) {
  return <script dangerouslySetInnerHTML={{ __html: js.replace(/\s+/gm, ' ') }} />; // Poor man's minification
}

export const onRenderBody = ({ setHeadComponents }: RenderBodyArgs, pluginOptions: InitOptions) => {
  let { analytics: { measurementId }, domain } = pluginOptions;
  let head: React.ReactNode[] = [];

  // Set up analytics. Client-side routing is tracked when Enhanced Measurement
  // is enabled: https://support.google.com/analytics/answer/9216061
  if (process.env.NODE_ENV == 'production') {
    head.push(<script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}></script>);
    head.push(script(`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${measurementId}');
    `));
  }

  // Prevent the site from being viewed from firebase's default domains
  head.push(script(`
    if (document.location.hostname != '${domain}' && document.location.hostname != 'localhost') {
      document.location.hostname = '${domain}';
    }
  `));

  setHeadComponents(head);
};

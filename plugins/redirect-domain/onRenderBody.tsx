import { PluginOptions, RenderBodyArgs } from 'gatsby';
import React from 'react';

interface RedirectDomainOptions extends PluginOptions {
  /**
   * The preferred domain.
   */
  to: string;
}

export const onRenderBody = ({ setHeadComponents }: RenderBodyArgs, { to }: RedirectDomainOptions) => {
  setHeadComponents([
    <script
      key='redirect-domain'
      dangerouslySetInnerHTML={{ __html: `
        if (document.location.hostname != %s && document.location.hostname != "localhost") {
          document.location.hostname = %s;
        }
      `.replace(/\s+/g, '').replace(/%s/g, JSON.stringify(to)) }}
    />
  ]);
};

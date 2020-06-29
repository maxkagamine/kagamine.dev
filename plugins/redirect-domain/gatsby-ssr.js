import React from 'react';

export const onRenderBody = ({ setHeadComponents }, { to }) => {
  setHeadComponents([
    <script
      dangerouslySetInnerHTML={{ __html: `
        if (document.location.hostname != %s && document.location.hostname != 'localhost') {
          document.location.hostname = %s;
        }
      `.replace(/\s+/g, '').replace(/%s/g, JSON.stringify(to)) }}
    />
  ]);
};

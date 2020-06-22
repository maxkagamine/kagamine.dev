import React from 'react';
import { Helmet } from 'react-helmet';

export const wrapPageElement = ({ element, props }) => {
  if (props.pageContext.locale == 'ja') {
    return <>
      <Helmet>
        <link href='https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap' rel='stylesheet' />
      </Helmet>
      {element}
    </>;
  }

  return element;
};

/* eslint-disable import/prefer-default-export, react/prop-types */
import React from 'react';
import Theme from './Theme';

export const wrapRootElement = ({ element }) => {
  return <Theme>{element}</Theme>;
};

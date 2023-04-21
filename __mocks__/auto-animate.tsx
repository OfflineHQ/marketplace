import React from 'react';

export const AutoAnimate = ({ children, ...rest }) => {
  return <div {...rest}>{children}</div>;
};

export default AutoAnimate;

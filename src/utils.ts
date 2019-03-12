import _ from 'lodash/fp';

export const getDocumentScrollTop = () => {
  return window.pageYOffset || document.documentElement.scrollTop;
};

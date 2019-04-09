import * as React from 'react';

import useGitalk from '../../hooks/useGitalk';
import useWindowScroll from '../../hooks/useWindowScroll';
import { isInViewportByElementId, replaceUrlWithoutRefresh } from '../../utils/helpers';

import 'gitalk/dist/gitalk.css';
import './index.scss';

const COMMENT_ELEMENT_ID = 'comment';

interface ICommentProps {
  id: number;
}

const Commemt = (props: ICommentProps) => {
  const { id } = props;
  useGitalk(COMMENT_ELEMENT_ID, id);

  // add `#comment` to url when scroll comment element into viewport
  useWindowScroll(() => {
    if (isInViewportByElementId(COMMENT_ELEMENT_ID)) {
      replaceUrlWithoutRefresh(`${location.pathname}#${COMMENT_ELEMENT_ID}`);
    } else if (location.hash) {
      replaceUrlWithoutRefresh(location.pathname);
    }
  }, /* resize = */ true);

  return <div id="comment" />;
};

export default Commemt;

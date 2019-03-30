import * as React from 'react';
import Gitalk from 'gitalk';
import 'gitalk/dist/gitalk.css';

import './index.scss';

interface ICommentProps {
  id: number;
}

const Commemt = (props: ICommentProps) => {
  const { id } = props;

  if (!id) {
    return null;
  }

  React.useEffect(() => {
    const gitalk = new Gitalk({
      clientID: 'af04686863d8fe77f3b3',
      clientSecret: '908c476e842511483d95125bf57c9669db71fe51',
      repo: 'blog',
      owner: 'ahonn',
      admin: ['ahonn'],
      id: location.pathname,
      number: id,
      distractionFreeMode: false,
    });

    gitalk.render('comment-container');
  }, [id]);

  return <div id="comment-container" className="comment" />;
};

export default Commemt;

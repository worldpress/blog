import * as React from 'react';
import Gitalk from 'gitalk';
import 'gitalk/dist/gitalk.css';

interface ICommentProps {
  id: number;
}

const Commemt = (props: ICommentProps) => {
  const { id } = props;

  React.useEffect(() => {
    const gitalk = new Gitalk({
      clientID: 'af04686863d8fe77f3b3',
      clientSecret: '908c476e842511483d95125bf57c9669db71fe51',
      repo: 'blog',
      owner: 'ahonn',
      admin: ['ahonn'],
      id: location.pathname,
      number: id,
      distractionFreeMode: true,
    });

    gitalk.render('comment-container');
  }, [id]);

  return <div id="comment-container" />;
};

export default Commemt;

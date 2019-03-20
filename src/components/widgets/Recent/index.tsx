import * as React from 'react';
import format from 'date-fns/format';
import { Link } from 'gatsby';

import useAllBlogPost from '../../../hooks/useAllBlogPost';
import './index.scss';

interface IRecentProps {
  size: number;
}

const Recent = (props: IRecentProps) => {
  const { size } = props;
  const posts = useAllBlogPost();

  return (
    <div className="widget recent">
      <h3 className="widget-title">
        &lt;最新文章 /&gt;
      </h3>
      <div className="widget-content">
        {posts.slice(0, size).map((post) => {
          const { id, created_at, title } = post;
          const postLink = `/${created_at}/${title}`;

          return (
            <div className="recent-post-item" key={id}>
              <Link
                className="recent-post-item__link"
                to={postLink}
              >
                <span className="recent-post-item-created_at">
                  {format(created_at, 'YYYY年MM月')}
                </span>
                <span className="recent-post-item-title">
                  {title}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Recent.defaultProps = {
  size: 5,
};

export default Recent;

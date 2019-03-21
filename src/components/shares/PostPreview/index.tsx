import * as React from 'react';
import { Link } from 'gatsby';
import { format } from 'date-fns';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

import './index.scss';

interface IPostPreviewProps {
  post: IBlogPost;
}

const PostPreview = (props: IPostPreviewProps) => {
  const { post } = props;
  const { tags, title, excerpt, body, created_at } = post;

  const postLink = `/${created_at}/${title}`;
  const readingTime = Math.round(body.length / 300);

  return (
    <div className="post-preview">
      <div className="post-header">
        <h2 className="post-title">
          <Link className="post-title__link" to={postLink}>
            {title}
          </Link>
        </h2>
        <div className="post-meta">
          <span className="post-created-at">
            <span className="post-meta__icon">
              <FaCalendarAlt />
            </span>
            {format(created_at, 'YYYY年MM月DD日')}
          </span>
          <span className="post-reading-time">
            <span className="post-meta__icon">
              <FaClock />
            </span>
            预计阅读需要 {readingTime} 分钟
          </span>
        </div>
      </div>
      <div className="post-content">
        <p className="post-excerpt">{excerpt}</p>
        <div className="post-read-more">
          <Link className="post-read-more__link" to={postLink}>
            阅读更多...
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;

import * as React from 'react';
import { Link } from 'gatsby';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';

import './index.scss';

library.add(faCalendarAlt, faClock);

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
            <FontAwesomeIcon className="post-meta__icon" icon="calendar-alt" size="sm" />
            {format(created_at, 'YYYY年MM月DD日')}
          </span>
          <span className="post-reading-time">
            <FontAwesomeIcon className="post-meta__icon" icon="clock" size="sm" />
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

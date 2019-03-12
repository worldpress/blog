import * as React from 'react';
import { navigate } from 'gatsby';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons';

import { IBlogPost } from '../../hooks/useAllBlogPost';
import './index.scss';

library.add(faClock);

interface IPostPreviewProps {
  post: IBlogPost;
}

const PostPreview = (props: IPostPreviewProps) => {
  const { post } = props;
  const { link, title, excerpt, created_at } = post;

  const handleClick = () => navigate(link);

  return (
    <div className="post-preview" onClick={handleClick}>
      <div className="post-header">
        <h2 className="post-title">{title}</h2>
        <div className="post-meta">
          <span className="post-created-at">
            <FontAwesomeIcon className="date-icon" icon="clock" size="sm" />
            {format(created_at, 'YYYY-MM-DD')}
          </span>
        </div>
      </div>
      <div className="post-content">
        <p className="post-excerpt">{excerpt}</p>
      </div>
    </div>
  );
};

export default PostPreview;

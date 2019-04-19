import * as React from 'react';
import { Link } from 'gatsby';
import { FaCalendarAlt, FaClock  } from 'react-icons/fa';

import PostContext, { IPostContext } from './context';
import { formatPostDate, formatReadingTime } from '../../utils/helpers';

const PostHeader = () => {
  const post = React.useContext(PostContext) as IPostContext;
  const { link, timeToRead, frontmatter: { title, date } } = post;

  return (
    <div className="post-header">
      <h2 className="post-title">
        <Link className="post-title__link" to={link}>
          {title}
        </Link>
      </h2>
      <div className="post-meta">
        <span className="post-created-at">
          <span className="post-meta__icon">
            <FaCalendarAlt />
          </span>
          {formatPostDate(date)}
        </span>
        <span className="post-reading-time">
          <span className="post-meta__icon">
            <FaClock />
          </span>
          {formatReadingTime(timeToRead)}
        </span>
      </div>
    </div>
  );
};

export default PostHeader;
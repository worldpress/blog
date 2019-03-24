import * as React from 'react';
import { Link } from 'gatsby';
import { format } from 'date-fns';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

import { formatPostDate, formatReadingTime } from '../../utils/helpers';
import './index.scss';

interface IPostPreviewProps {
  post: IMarkdownRemarkNode;
}

const PostPreview = (props: IPostPreviewProps) => {
  const { frontmatter: { title, date }, excerpt, timeToRead } = props.post;
  const postLink = `/${date}/${title}`;

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

import * as React from 'react';
import { Link } from 'gatsby';
import classnames from 'classnames';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

import { formatPostDate, formatReadingTime } from '../../utils/helpers';
import './index.scss';

interface IPostDetailProps {
  post: IMarkdownRemarkNode;
  excerpt?: boolean;
}

const Post = (props: IPostDetailProps) => {
  const { post, excerpt } = props;
  const { frontmatter: { title, date }, html, excerpt: exp, timeToRead } = post;
  const postLink = `/${date}/${title}`;

  const clazz = classnames({
    post: true,
    excerpt,
  });

  return (
    <div className={clazz}>
      <div className="post-header">
        {excerpt ? (
          <h2 className="post-title">
            <Link className="post-title__link" to={postLink}>
              {title}
            </Link>
          </h2>
        ) : (
          <h1 className="post-title">
            {title}
          </h1>
        )}
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
        {excerpt ? (
          <div>
            <p className="post-excerpt">{exp}</p>
            <div className="post-read-more">
              <Link className="post-read-more__link" to={postLink}>
                阅读更多...
              </Link>
            </div>
          </div>
        ) : (
          <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
    </div>
  );
};

Post.defaultProps = {
  excerpt: false,
};

export default Post;

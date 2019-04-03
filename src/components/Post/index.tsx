import * as React from 'react';
import { Link } from 'gatsby';
import classnames from 'classnames';
import { FaCalendarAlt, FaClock, FaHashtag } from 'react-icons/fa';

import { getPostLink, formatPostDate, formatReadingTime } from '../../utils/helpers';
import { TAG_SYMBOL } from '../../consts';
import './index.scss';

interface IPostDetailProps {
  post: IMarkdownRemarkNode;
  excerpt?: boolean;
}

const Post = (props: IPostDetailProps) => {
  const { post, excerpt } = props;
  const {
    frontmatter: { title, date, tags },
    html,
    excerpt: exp,
    timeToRead,
  } = post;
  const postLink = getPostLink(post);

  const clazz = classnames({
    post: true,
    excerpt,
  });

  return (
    <article className={clazz}>
      <div className="post-header">
        {excerpt ? (
          <h2 className="post-title">
            <Link className="post-title__link" to={postLink}>
              {title}
            </Link>
          </h2>
        ) : (
          <h1 className="post-title">{title}</h1>
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
      {!excerpt && (
        <div className="post-footer">
          <div className="post-tags">
            {tags.map((name) => (
              <span className="post-tag" key={name}>
                <span className="post-tag__icon">
                  <FaHashtag />
                </span>
                <Link className="post-tag__link" to={`/search?keyword=${TAG_SYMBOL} ${name}`}>
                  {name}
                </Link>
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

Post.defaultProps = {
  excerpt: false,
};

export default Post;

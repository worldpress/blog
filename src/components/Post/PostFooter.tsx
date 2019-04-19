import * as React from 'react';
import { Link } from 'gatsby';
import { FaHashtag } from 'react-icons/fa';

import PostContext, { IPostContext } from './context';
import { TAG_SYMBOL } from '../../consts';

const PostFooter = () => {
  const post = React.useContext(PostContext) as IPostContext;
  const { simple, frontmatter: { tags } } = post;

  if (simple) {
    return null;
  }

  return (
    <div className="post-footer">
      <div className="post-tags">
        {tags.map((name) => (
          <span className="post-tag" key={name}>
            <span className="post-tag__icon">
              <FaHashtag />
            </span>
            <Link
              className="post-tag__link"
              to={`/search?keyword=${TAG_SYMBOL} ${name}`}
            >
              {name}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
};

export default PostFooter;
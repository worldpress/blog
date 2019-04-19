import * as React from 'react';
import { Link } from 'gatsby';

import PostContext, { IPostContext } from './context';

const PostContent = () => {
  const post = React.useContext(PostContext) as IPostContext;
  const { link, excerpt, html, simple } = post;

  return (
    <div className="post-content">
      {simple ? (
        <div>
          <p className="post-simple">{excerpt}</p>
          <div className="post-read-more">
            <Link className="post-read-more__link" to={link}>
              阅读更多...
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
};

export default PostContent;

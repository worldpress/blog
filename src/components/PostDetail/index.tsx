import * as React from 'react';

import './index.scss';

interface IPostDetailProps {
  post: IMarkdownRemarkNode;
}

const PostDetail = (props: IPostDetailProps) => {
  const { frontmatter: { title }, html } = props.post;

  return (
    <div className="post-detail">
      <div className="post-header">
        <h1 className="post-title">
          {title}
        </h1>
      </div>
      <div className="post-content">
        <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

export default PostDetail;

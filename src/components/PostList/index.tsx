import * as React from 'react';

import './index.scss';
import { IBlogPost } from '../../hooks/useBlogPosts';
import PostPreview from '../PostPreview';

interface IPostListProps {
  dataSource: IBlogPost[];
}

const PostList = (props: IPostListProps) => {
  const { dataSource } = props;
  return (
    <div className="post-list">
      {dataSource.map((post: IBlogPost) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;

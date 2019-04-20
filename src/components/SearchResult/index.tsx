import * as React from 'react';

import Post from '../Post';
import './index.scss';

interface ISearchResultProps {
  posts: IMarkdownRemarkNode[];
}

const SearchResult = (props: ISearchResultProps) => {
  const { posts } = props;

  return (
    <div className="search-result">
      {posts.map((node: IMarkdownRemarkNode) => (
        <Post key={node.id} post={node} simple />
      ))}
    </div>
  );
};

export default SearchResult;

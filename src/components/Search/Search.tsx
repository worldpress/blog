import * as React from 'react';

import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
import useQueryParam from '../../hooks/useQueryParam';
import useSearchResult from '../../hooks/useSearchResult';

type ISearchProps = {
  posts: IMarkdownRemarkNodep[];
};

const Search = (props: ISearchProps) => {
  const { posts } = props;
  const [keyword = '', setKeyword] = useQueryParam(location, 'keyword');
  const result = useSearchResult(posts, keyword as string);

  return (
    <div>
      <SearchInput value={keyword} count={result.length} onChange={setKeyword} />
      <SearchResult dataSource={result} />
    </div>
  );
};

export default Search;

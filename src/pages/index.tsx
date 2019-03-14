import * as React from 'react';
import queryString from 'query-string';
import _ from 'lodash/fp';

import useAllBlogPost from '../hooks/useAllBlogPost';
import DefaultLayout from '../layouts/DefaultLayout';
import PostList from '../components/PostList';
import Pagination from '../components/Pagination';

interface IIndexPageProps {
  location: Location;
}

const PAGE_SIZE = 15;

export default (props: IIndexPageProps) => {
  const query = queryString.parse(props.location.search);
  const pageNum = _.toNumber(query.page || 1);

  const allBlogPost = useAllBlogPost();
  const total = allBlogPost.length;
  const posts = allBlogPost.slice((pageNum - 1) * PAGE_SIZE , pageNum * PAGE_SIZE);

  return (
    <DefaultLayout location={location}>
      <PostList dataSource={posts} />
      <Pagination page={pageNum} size={PAGE_SIZE} total={total} />
    </DefaultLayout>
  );
};

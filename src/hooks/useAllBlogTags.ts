import * as _ from 'lodash/fp';
import useAllBlogPost from './useAllBlogPost';

const useAllBlogTags = (): IBlogTags => {
  const allBlogPost = useAllBlogPost();
  const allBlogTags = allBlogPost.reduce((tags: IBlogTags, post: IBlogPost): IBlogTags => {
    post.tags.forEach((tag: string) => {
      if (tags[tag] === undefined) {
        tags[tag] = 1;
      } else {
        tags[tag] += 1;
      }
    });
    return tags;
  }, {})

  return allBlogTags;
};

export default useAllBlogTags;

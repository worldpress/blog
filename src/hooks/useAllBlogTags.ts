import * as _ from 'lodash/fp';
import useAllBlogPost from './useAllBlogPost';

const useAllBlogTags = () => {
  const allBlogPost = useAllBlogPost();
  const allBlogTags = allBlogPost.reduce((tags: string[], post: IBlogPost): string[] => {
    post.tags.forEach(tag => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
    return tags;
  }, [])

  return allBlogTags;
};

export default useAllBlogTags;

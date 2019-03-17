import useAllBlogPost from "./useAllBlogPost";

const useAllBlogArchives = (): IBlogArchives => {
  const allBlogPost = useAllBlogPost();
  const allBlogArchives = allBlogPost.reduce((archives: IBlogArchives, post: IBlogPost) => {
    const { created_at } = post;
    if (archives[created_at] === undefined) {
      archives[created_at] = [];
    }
    archives[created_at].push(post);

    return archives;
  }, {});

  return allBlogArchives;
};

export default useAllBlogArchives;
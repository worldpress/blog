import _ from 'lodash/fp';
import parse from 'date-fns/parse';
import format from 'date-fns/format';

// getDocumentScrollTop :: () -> number
export const getDocumentScrollTop = () => {
  console.log();
  return window.pageYOffset || document.documentElement.scrollTop;
};

// FIXME
// getArchivesGroupByMonth :: IBlogBlog[] -> { [month: string]: IBlogBlog }
export const getArchivesGroupByMonth = _.compose(
  _.sortBy(({ month }) => -parse(month)),
  _.mapValues(_.identity),
  _.reduce((archives: IBlogArchives[], post: IBlogPost) => {
    const { created_at } = post;
    const month = format(created_at, 'YYYY/MM');

    if (archives[month]) {
      archives[month].count += 1;
      archives[month].posts.push(post);
    } else {
      archives[month] = {
        month,
        count: 1,
        posts: [post],
      };
    }
    return archives;
  }, []),
);

// FIXME
// getSortedTagsByPosts :: IBlogPost[] -> IBlogTags[]
export const getSortedTagsByPosts = _.compose(
  _.sortBy(({ count }) => -count),
  _.mapValues(_.identity),
  _.reduce((tags: IBlogTags[], post: IBlogPost) => {
    _.forEach((name) => {
      if (tags[name]) {
        tags[name].count += 1;
        tags[name].posts.push(post);
      } else {
        tags[name] = {
          name,
          count: 1,
          posts: [post],
        };
      }
    }, post.tags);
    return tags;
  }, []),
);

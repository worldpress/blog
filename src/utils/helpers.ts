import _ from 'lodash/fp';
import format from 'date-fns/format';

// getPostLink :: IMarkdownRemarkNode -> string
export const getPostLink = (post: IMarkdownRemarkNode) => {
  const { frontmatter: { date, title } } = post;
  return `/${date}/${title}/`;
};

// formatPostDate :: string -> string
export const formatPostDate = (date: string) => {
  return format(date, 'YYYY年MM月DD日');
};

// formatReadingTime :: number -> string
export const formatReadingTime = (time: number) => {
  const minutes = Math.round(time * 2);
  return `预计阅读需要 ${minutes} 分钟`;
};

// getDocumentScrollTop :: () -> number
export const getDocumentScrollTop = () => {
  return window.pageYOffset || document.documentElement.scrollTop;
};

// getMarkdownRemarkEdgeNode :: ImarkdownRemark -> IMarkdownRemarkNode[]
export const getMarkdownRemarkEdgeNode = _.compose(
  _.map('node'),
  _.get('allMarkdownRemark.edges'),
);

// groupByDateFromPost :: IMarkdownRemarkNode[] -> Dictionary<ImarkdownRemarkNode[]>
export const groupByDateFromPost = _.groupBy(_.compose(
  (date) => format(date, 'YYYY/MM'),
  _.get('frontmatter.date'),
));

export const collectTagNamesFromPost = _.compose(
  _.uniq,
  _.reduce(_.concat, []),
  _.map('frontmatter.tags'),
);

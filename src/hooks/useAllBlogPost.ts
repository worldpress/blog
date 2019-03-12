import * as _ from 'lodash/fp';
import { useStaticQuery, graphql } from 'gatsby';

const markdownFile2Post = _.map(
  (markdownFile: IMarkdownFile): IBlogPost => {
    const {
      id,
      frontmatter: { title, date, tags },
      excerpt,
      rawMarkdownBody,
      fileAbsolutePath,
    } = markdownFile;

    return {
      id,
      tags,
      title,
      excerpt,
      body: rawMarkdownBody,
      created_at: date,
      updated_at: date,
    };
  },
);

const mapEdgesNode = _.compose(
  _.map(_.prop('node')),
  _.prop('edges'),
);

const useAllBlogPost = (): IBlogPost[] => {
  const { allMarkdownRemark, allGithubIssue } = useStaticQuery(graphql`
    query GetAllBlogPost {
      allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              date(formatString: "YYYY/MM/DD")
              tags
            }
            excerpt(truncate: true)
            rawMarkdownBody
            fileAbsolutePath
          }
        }
      }
    }
  `);

  return markdownFile2Post(mapEdgesNode(allMarkdownRemark));
};

export default useAllBlogPost;

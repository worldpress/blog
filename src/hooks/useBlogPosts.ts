import * as _ from 'lodash/fp';
import { useStaticQuery, graphql } from 'gatsby';

interface IYuqueDoc {
  id: number;
  title: string;
  description: string;
  body: string;
  created_at: string;
}

interface IMarkdownPostNode {
  id: number;
  frontmatter: {
    title: string;
    date: string;
  };
  excerpt: string;
  rawMarkdownBody: string;
  fileAbsolutePath: string;
}

interface IBlogPost {
  id: number;
  title: string;
  excerpt: string;
  body: string;
  created_at: string;
  type: string;
}

const mapEdgesNode = _.compose(
  _.map(_.prop('node')),
  _.prop('edges'),
);

const yuqueDoc2Post = _.map((doc: IYuqueDoc): IBlogPost => {
  const { id, title, description, body, created_at } = doc;
  return {
    id,
    title,
    excerpt: description,
    body,
    created_at,
    type: 'yuque',
  };
});

const markdown2Post = _.compose(
  _.map((markdown: IMarkdownPostNode): IBlogPost => {
    const { id, frontmatter: { title, date }, excerpt, rawMarkdownBody } = markdown;
    return {
      id,
      title,
      excerpt,
      body: rawMarkdownBody,
      created_at: date,
      type: 'markdown',
    };
  }),
  // @ts-ignore
  _.filter('fileAbsolutePath'),
);

const sortByCreatedTimeDesc = _.compose(
  _.reverse,
  _.sortBy(['created_at']),
);

const useBlogPosts = (): IBlogPost[] => {
  const { allYuqueDoc, allMarkdownRemark } = useStaticQuery(graphql`
    query GetAllBlogPost {
      allYuqueDoc {
        edges {
          node {
            id
            title
            body
            description
            created_at
          }
        }
      }
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              title
              date
            }
            excerpt
            rawMarkdownBody
            fileAbsolutePath
          }
        }
      }
    }
  `);

  const posts = sortByCreatedTimeDesc([
    ...yuqueDoc2Post(mapEdgesNode(allYuqueDoc)),
    ...markdown2Post(mapEdgesNode(allMarkdownRemark)),
  ]);

  return posts as IBlogPost[];
};

export default useBlogPosts;

import * as _ from 'lodash/fp';
import { useStaticQuery, graphql } from 'gatsby';
import { getYuqueDocLink, getMarkdownPostLink } from '../utils';

export interface IYuqueDoc {
  id: number;
  title: string;
  slug: string;
  description: string;
  body: string;
  created_at: string;
}

export interface IMarkdownFile {
  id: number;
  frontmatter: {
    title: string;
    date: string;
  };
  excerpt: string;
  rawMarkdownBody: string;
  fileAbsolutePath: string;
}

export interface IBlogPost {
  id: number;
  title: string;
  link: string;
  excerpt: string;
  body: string;
  created_at: string;
}

const mapEdgesNode = _.compose(
  _.map(_.prop('node')),
  _.prop('edges'),
);

const yuqueDoc2Post = _.map((doc: IYuqueDoc): IBlogPost => {
  const { id, title, description, body, created_at } = doc;
  const link = getYuqueDocLink(doc);

  return {
    id,
    link,
    title,
    excerpt: description,
    body,
    created_at,
  };
});

const markdown2Post = _.compose(
  _.map((markdownFile: IMarkdownFile): IBlogPost => {
    const { id, frontmatter: { title, date }, excerpt, rawMarkdownBody } = markdownFile;
    const link = getMarkdownPostLink(markdownFile);

    return {
      id,
      link,
      title,
      excerpt,
      body: rawMarkdownBody,
      created_at: date,
    };
  }),
  // @ts-ignore
  _.filter('fileAbsolutePath'),
);

const sortByCreatedTimeDesc = _.compose(
  _.reverse,
  _.sortBy(['created_at']),
);

const useAllBlogPost = (): IBlogPost[] => {
  const { allYuqueDoc, allMarkdownRemark } = useStaticQuery(graphql`
    query GetAllBlogPost {
      allYuqueDoc {
        edges {
          node {
            id
            slug
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
            excerpt(truncate: true)
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

export default useAllBlogPost;

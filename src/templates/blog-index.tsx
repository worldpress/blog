import * as React from 'react';
import { graphql } from 'gatsby';
import { Container, Row, Col } from 'react-bootstrap';

import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Post from '../components/Post';
import Pagination from '../components/Pagination';
import RecentWidget from '../components/RecentWidget';
import TagsWidget from '../components/TagsWidget';
import ArchivesWidget from '../components/ArchivesWidget';

import { getMarkdownRemarkEdgeNode } from '../utils/helpers';

interface IIndexPageProps {
  location: Location;
  data: {
    allMarkdownRemark: IMarkdownRemark;
  };
  pageContext: {
    page: number;
    total: number;
    limit: number;
  };
}

const IndexPageTemplate = (props: IIndexPageProps) => {
  const { location, data, pageContext } = props;
  const posts = getMarkdownRemarkEdgeNode(data);
  const { page, total, limit } = pageContext;

  return (
    <Layout location={location}>
      <SEO />
      <Container>
        <Row>
          <Col lg={8}>
            <div className="posts">
              {posts.map((node: IMarkdownRemarkNode) => (
                <Post key={node.id} post={node} excerpt />
              ))}
            </div>
            <Pagination page={page} size={limit} total={total} />
          </Col>
          <Col lg={4}>
            <div className="widgets">
              <RecentWidget posts={posts} />
              <TagsWidget posts={posts} />
              <ArchivesWidget posts={posts} />
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query GetAllBlogPost($skip: Int, $limit: Int) {
    allMarkdownRemark(
      skip: $skip,
      limit: $limit,
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
          fields {
            slug
          }
          excerpt(truncate: true)
          timeToRead
        }
      }
    }
  }
`;

export default IndexPageTemplate;

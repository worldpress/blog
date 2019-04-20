import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { graphql } from 'gatsby';
import _ from 'lodash/fp';

import Layout from '../components/Layout';
import Search from '../components/Search';
import { getMarkdownRemarkEdgeNode } from '../utils/helpers';

interface ISearchPageProps {
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

const SearchPage = (props: ISearchPageProps) => {
  const { location, data } = props;
  const posts = getMarkdownRemarkEdgeNode(data);

  return (
    <Layout location={location}>
      <Container>
        <Row className="justify-content-md-center">
          <Col lg={10}>
            <Search posts={posts} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query GetSearchPost {
    allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
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
          rawMarkdownBody
          timeToRead
        }
      }
    }
  }
`;

export default SearchPage;

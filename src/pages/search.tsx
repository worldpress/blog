import * as React from 'react';
import { graphql } from 'gatsby';
import _ from 'lodash/fp';
import { Container, Row, Col } from 'react-bootstrap';

import Layout from '../components/Layout';
import SearchInput from '../components/SearchInput';
import SearchResult from '../components/SearchResult';
import useQueryParam from '../hooks/useQueryParam';
import useSearchResult from '../hooks/useSearchResult';
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

  const [keyword = '', setKeyword] = useQueryParam(location, 'keyword');
  const result = useSearchResult(posts, keyword as string);

  return (
    <Layout location={location}>
      <Container>
        <Row className="justify-content-md-center">
          <Col lg={10}>
            <SearchInput value={keyword} onChange={setKeyword} />
            {result.length > 0 && (
              <SearchResult posts={result} />
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query GetSearchPost {
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
          timeToRead
        }
      }
    }
  }
`;

export default SearchPage;

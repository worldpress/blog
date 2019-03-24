import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import PostDetail from '../components/PostDetail';

interface IPostPageProps {
  location: Location;
  data: {
    markdownRemark: IMarkdownRemarkNode;
  };
  pageContext: {
    id: string;
  };
}

const PostPageTemplate = (props: IPostPageProps) => {
  const { location, data } = props;

  return (
    <Layout location={location}>
      <Container>
        <Row className="justify-content-md-center">
          <Col lg={8}>
            <PostDetail post={data.markdownRemark} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query GetBlogPost($id: String) {
    markdownRemark(id: { eq: $id }) {
      id
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
        tags
      }
      excerpt(truncate: true)
      html
    }
  }
`;

export default PostPageTemplate;

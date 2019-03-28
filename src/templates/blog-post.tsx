import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { graphql } from 'gatsby';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import Post from '../components/Post';

import { getPostLink } from '../utils/helpers';

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
  const post = data.markdownRemark;
  const postLink = getPostLink(post);

  return (
    <Layout location={location}>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        slug={postLink}
      />
      <Container>
        <Row className="justify-content-md-center">
          <Col lg={10}>
            <Post post={data.markdownRemark} />
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
      timeToRead
    }
  }
`;

export default PostPageTemplate;

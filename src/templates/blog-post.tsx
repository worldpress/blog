import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { graphql, navigate } from 'gatsby';

import SEO from '../components/SEO';
import Layout from '../components/Layout';
import Post from '../components/Post';
import Comment from '../components/Comment';

import { getPostLink } from '../utils/helpers';

interface IPostPageProps {
  location: Location;
  data: {
    markdownRemark: IMarkdownRemarkNode;
  };
  pageContext: {
    id: string;
    redirect?: boolean;
    redirectUrl?: string;
  };
}

const PostPageTemplate = (props: IPostPageProps) => {
  const { location, data, pageContext } = props;
  const { redirect = false, redirectUrl } = pageContext;

  const post = data.markdownRemark;
  const postLink = getPostLink(post);
  const postCommentId = post.frontmatter.issueId;

  // Used for redirect the old hexo blog posts.
  // Because when I use gatsby createRedirect in gatsby-node.js.
  // In the production environment will rendered 404 page before redirect.
  const meta = [];
  if (redirect) {
    meta.push({
      'http-equiv': 'refresh',
      'content': `0; url='${redirectUrl}'`,
    });
  }

  return (
    <Layout location={location}>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        slug={postLink}
        meta={meta}
      />
      <Container>
        <Row className="justify-content-md-center">
          <Col lg={10}>
            <Post post={data.markdownRemark} />
            <Comment id={postCommentId} />
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
        issueId
      }
      excerpt(truncate: true)
      html
      timeToRead
    }
  }
`;

export default PostPageTemplate;

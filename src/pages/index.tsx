import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import useBlogPosts from '../hooks/useBlogPosts';
import DefaultLayout from '../layouts/DefaultLayout';

interface IIndexPageProps {
  location: Location;
}

export default (props: IIndexPageProps) => {
  const { location } = props;
  const posts = useBlogPosts();

  return (
    <DefaultLayout location={location}>
      <Container>
        <Row>
          <Col lg={8}>
            {posts.map(post => {
              const { title, body } = post;
              return (
                <div>
                  <h3>{title}</h3>
                </div>
              );
            })}
          </Col>
          <Col lg={4} />
        </Row>
      </Container>
    </DefaultLayout>
  );
};

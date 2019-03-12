import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import DefaultLayout from '../../layouts/DefaultLayout';

interface IPostTemplateProps {
  location: Location;
  pageContext: {
    id: string;
    type: string;
  };
}

const PostTemplate = (props: IPostTemplateProps) => {
  const { location, pageContext } = props;

  return (
    <DefaultLayout location={location}>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
          </Col>
        </Row>
      </Container>
    </DefaultLayout>
  );
};

export default PostTemplate;

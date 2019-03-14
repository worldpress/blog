import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TagCloud from '../../components/TagCloud';

import './index.scss';

interface IDefaultLayoutProps extends React.HTMLProps<HTMLDivElement> {
  location: Location;
  children: React.ReactNode;
}

const DefaultLayout = (props: IDefaultLayoutProps) => {
  const {
    location: { pathname },
  } = props;
  return (
    <div className="layout default">
      <Header pathname={pathname} />
      <div className="content">
        <Container>
          <Row>
            <Col lg={8}>
              {props.children}
            </Col>
            <Col lg={4}>
              <TagCloud />
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

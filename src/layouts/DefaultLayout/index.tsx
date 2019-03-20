import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Recent from '../../components/widgets/Recent';
import Tags from '../../components/widgets/Tags';
import Archives from '../../components/widgets/Archives';

import useSiteMetadata from '../../hooks/useSiteMetadata';
import './index.scss';

interface IDefaultLayoutProps extends React.HTMLProps<HTMLDivElement> {
  location: Location;
  children: React.ReactNode;
}

const DefaultLayout = (props: IDefaultLayoutProps) => {
  const { location } = props;
  const metadata = useSiteMetadata();

  return (
    <div className="layout default">
      <Header location={location} metadata={metadata} />
      <div className="content">
        <Container>
          <Row>
            <Col lg={8}>
              {props.children}
            </Col>
            <Col lg={4}>
              <Recent />
              <Tags />
              <Archives />
            </Col>
          </Row>
        </Container>
      </div>
      <Footer metadata={metadata} />
    </div>
  );
};

export default DefaultLayout;

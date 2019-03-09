import * as React from 'react';
import { Container, Row } from 'react-bootstrap';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
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
        {props.children}
      </div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;

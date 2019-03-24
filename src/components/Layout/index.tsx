import * as React from 'react';
import { get } from 'lodash/fp';
import { graphql, useStaticQuery } from 'gatsby';

import Header from '../Header';
import Footer from '../Footer';

import './index.scss';

interface ILayoutProps extends React.HTMLProps<HTMLDivElement> {
  location: Location;
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  const { location } = props;
  const data = useStaticQuery(graphql`
    query GetSiteMetadata {
      site {
        siteMetadata {
          title
          since
          author
          menu {
            name
            path
          }
          socials {
            name
            link
          }
          friends {
            name
            link
          }
        }
      }
    }
  `);
  const metadata = get('site.siteMetadata', data);

  return (
    <div className="layout">
      <Header location={location} metadata={metadata} />
      <div className="content">
        {props.children}
      </div>
      <Footer metadata={metadata} />
    </div>
  );
};

export default Layout;

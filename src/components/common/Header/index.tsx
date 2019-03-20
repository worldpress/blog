import * as React from 'react';
import classnames from 'classnames';
import { navigate, Link } from 'gatsby';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCode } from '@fortawesome/free-solid-svg-icons';

import useWindowScroll from '../../../hooks/useWindowScroll';
import { getDocumentScrollTop } from '../../../utils';

import './index.scss';

library.add(faCode);

interface IHeaderComponentProps {
  location: Location;
  metadata: ISiteMetadata;
}

let headerHeight: number = 0;

const Header = (props: IHeaderComponentProps) => {
  const { pathname } = props.location;
  const { title, menu } = props.metadata;

  const [hide, setHide] = React.useState(false);
  const [lastScrollTop, setLastScrollTop] = React.useState(getDocumentScrollTop());
  const headerRef = React.createRef<HTMLDivElement>();

  useWindowScroll((event) => {
    const scrollTop = getDocumentScrollTop();
    if (!headerHeight) {
      headerHeight = headerRef.current.offsetHeight / 2;
    }

    const outrideHeader = scrollTop < headerHeight;
    const isScrollUp = scrollTop < lastScrollTop;

    setHide(!(outrideHeader || isScrollUp));
    setLastScrollTop(scrollTop);
  });

  const headerClassName = classnames({ header: true, hide });

  return (
    <header className={headerClassName} ref={headerRef}>
      <Container>
        <div className="title">
          <h1 className="title-link" onClick={() => navigate('/')}>
            <FontAwesomeIcon
              className="title-icon"
              icon="code"
              size="sm"
              color="#dc001c"
            />
            {title}
          </h1>
        </div>
        <nav className="nav">
          <ul className="menu">
            {menu.map(({ name, path }) => {
              const itemClasss = classnames({
                'menu-item': true,
                'active': path === pathname,
              });
              return (
                <li className={itemClasss} key={path}>
                  <Link to={path} className="menu-link">
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;

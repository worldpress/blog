import * as React from 'react';
import classnames from 'classnames';
import { navigate, Link } from 'gatsby';
import { Container } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import _ from 'lodash/fp';

import useWindowScroll from '../../hooks/useWindowScroll';
import { getDocumentScrollTop } from '../../utils/helpers';

import iconPng from '../../assets/icon.png';
import './index.scss';

interface IHeaderComponentProps {
  location: Location;
  metadata: ISiteMetadata;
}

let headerHeight: number = 0;

const Header = (props: IHeaderComponentProps) => {
  const { pathname } = props.location;
  const { title, menu } = props.metadata;

  const [hide, setHide] = React.useState(false);
  const [lastScrollTop, setLastScrollTop] = React.useState(0);
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
          <h1 className="title__link" onClick={() => navigate('/')}>
            <img className="title__icon" src={iconPng} alt={title} />
            {title}
          </h1>
        </div>
        <nav className="nav">
          <ul className="menu">
            {menu.map(({ name, path, header }) => {
              if (!header) {
                return null;
              }

              if (path === '/search') {
                return (
                  <li key={path} className="menu-item search">
                    <Link to="/search" className="menu-item__link" aria-label={name}>
                      <FaSearch className="menu-item__icon" />
                    </Link>
                  </li>
                );
              }

              const itemClasss = classnames({
                'menu-item': true,
                'active': path === pathname,
              });
              return (
                <li className={itemClasss} key={path}>
                  {path.startsWith('http') ? (
                    <a href={path} className="menu-item__link" target="__blank" aria-label={name}>
                      {name}
                    </a>
                  ) : (
                    <Link to={path} className="menu-item__link" aria-label={name}>
                      {name}
                    </Link>
                  )}
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

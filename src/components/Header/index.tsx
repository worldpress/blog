import * as React from 'react';
import classnames from 'classnames';
import { navigate, Link } from 'gatsby';
import { Container } from 'react-bootstrap';
import { FaCode } from 'react-icons/fa';

import useWindowScroll from '../../hooks/useWindowScroll';
import { getDocumentScrollTop } from '../../utils/helpers';

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
            <span className="title__icon">
              <FaCode />
            </span>
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
                  <Link to={path} className="menu-item__link">
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

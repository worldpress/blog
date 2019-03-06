import * as React from 'react';
import { Link } from 'gatsby';
import classnames from 'classnames';

import useSiteMetadata from '../../hooks/useSiteMetadata';
import useScroll from '../../hooks/useScroll';
import { getDocumentScrollTop } from '../../utils';

import './index.scss';

interface IHeaderComponentProps {
  pathname: string;
}

const Header = (props: IHeaderComponentProps) => {
  const { pathname } = props;

  const { title, menu } = useSiteMetadata();
  const [visible, setVisible] = React.useState(true);
  const [lastScrollTop, setLastScrollTop] = React.useState(getDocumentScrollTop())

  const headerRef = React.createRef<HTMLDivElement>();
  let headerHeight = -1;

  useScroll(event => {
    const scrollTop = getDocumentScrollTop();
    headerHeight = headerHeight || headerRef.current.offsetHeight;

    const isVisible = (scrollTop < headerHeight) || (scrollTop < lastScrollTop);
    setVisible(isVisible);
    setLastScrollTop(scrollTop);
  });

  const headerClassName = classnames({ header: true, visible });

  return (
    <header className={headerClassName} ref={headerRef}>
      <div className="title">
        <Link className="title-link" to="/">
          {title}
        </Link>
      </div>
      <nav className="nav">
        <ul className="menu">
          {menu.map(({ name, path }) => {
            const itemClasss = classnames({
              'menu-item': true,
              active: path === pathname,
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
    </header>
  );
};

export default Header;

import * as React from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import './index.scss';

library.add(faHeart);

interface IFooterProps {
  metadata: ISiteMetadata;
}

const Footer = (props: IFooterProps) => {
  const { since, author, menu, socials, friends } = props.metadata;

  const currentYear = new Date().getFullYear();
  const extra = [
    { title: 'SOCIALS / 社交', items: socials },
    { title: 'FRIENDS / 友链', items: friends },
  ];

  return (
    <footer className="footer">
      <div className="copyright">
        <ul className="menu">
          {menu.map(({ name, path }) => (
            <li className="menu-item" key={path}>
              <Link to={path} className="menu-link">
                {name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="copyright-text">
          <span>
            Copyright &copy; {since} - {currentYear}
          </span>
          <FontAwesomeIcon className="copyright-icon" icon="heart" />
          <span>{author}</span>
        </div>
        <div className="power-by">
          <span className="power-item">
            Power by
            <a className="power-link" href="https://www.gatsbyjs.org/">
              Gatsbyjs
            </a>
          </span>
          <span className="power-item">
            Design by
            <a className="power-link" href="https://github.com/ahonn">
              Ahonn
            </a>
          </span>
        </div>
      </div>
      <div className="extra">
        {extra.map(({ title, items }) => (
          <div className="block" key={title}>
            <span className="block-title">{title}</span>
            <ul className="block-items">
              {items.map(({ name, link }) => (
                <li className="block-item" key={link}>
                  <a className="block-link" href={link}>
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;

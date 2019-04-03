import * as React from 'react';
import { Link, withPrefix } from 'gatsby';
import { FaHeart } from 'react-icons/fa';
import { Container, Row, Col } from 'react-bootstrap';

import './index.scss';

interface IFooterProps {
  metadata: ISiteMetadata;
}

const Footer = (props: IFooterProps) => {
  const { since, author, menu, socials, friends } = props.metadata;

  const currentYear = new Date().getFullYear();
  const extra = [{ title: 'SOCIALS / 社交', items: socials }, { title: 'FRIENDS / 友链', items: friends }];

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="copyright">
              <ul className="menu">
                {menu.map(({ name, path }) => (
                  <li className="menu-item" key={path}>
                    {path.startsWith('http') ? (
                      <a href={path} className="menu-item__link" target="__blank">
                        {name}
                      </a>
                    ) : (
                      <Link to={path} className="menu-item__link">
                        {name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="copyright__text">
                <span>
                  Copyright &copy; {since} - {currentYear}
                </span>
                <span className="copyright__icon">
                  <FaHeart />
                </span>
                <span>{author}</span>
              </div>
              <div className="power-by">
                <span className="power-item">
                  Power by
                  <a className="power-item__link" href="https://www.gatsbyjs.org/">
                    Gatsbyjs
                  </a>
                </span>
                <span className="power-item">
                  Design by
                  <a className="power-item__link" href="https://github.com/ahonn">
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
                        <a className="block-item__link" href={link}>
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

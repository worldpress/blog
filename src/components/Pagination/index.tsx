import * as React from 'react';
import { Link } from 'gatsby';
import _ from 'lodash/fp';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import './index.scss';

library.add(faChevronLeft, faChevronRight);

interface IPagintionProps {
  page: number;
  size: number;
  total: number;
}

const Pagination = (props: IPagintionProps) => {
  const { page, size, total } = props;
  const totalPage = Math.ceil(total / size);

  const hasBefore = page !== totalPage;
  const hasAfter = page !== 1;

  return (
    <div className="pagination">
      {hasBefore && (
        <div className="pagination-before">
          <Link className="pagination-link" to={`/?page=${page + 1}`}>
            <FontAwesomeIcon className="pagination-icon" icon="chevron-left" />
            <span className="pagination-text">
              在这之前
            </span>
          </Link>
        </div>
      )}
      {hasAfter && (
        <div className="pagination-after">
          <Link className="pagination-link" to={`/?page=${page - 1}`}>
            <span className="pagination-text">
              在这之后
            </span>
            <FontAwesomeIcon className="pagination-icon" icon="chevron-right" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Pagination;

import * as React from 'react';
import { Link } from 'gatsby';
import _ from 'lodash/fp';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import './index.scss';

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
          <Link className="pagination__link" to={`/?page=${page + 1}`}>
            <span className="pagination__icon">
              <FaChevronLeft />
            </span>
            <span className="pagination__text">
              在这之前
            </span>
          </Link>
        </div>
      )}
      {hasAfter && (
        <div className="pagination-after">
          <Link className="pagination__link" to={`/?page=${page - 1}`}>
            <span className="pagination-text">
              在这之后
            </span>
            <span className="pagination__icon">
              <FaChevronRight />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Pagination;

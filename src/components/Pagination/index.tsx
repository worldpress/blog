import * as React from 'react';
import { navigate } from 'gatsby';
import _ from 'lodash/fp';

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
        <div className="before" onClick={() => navigate(`/?page=${page + 1}`)}>
          <span className="brefore-text">
            &::before
          </span>
        </div>
      )}
      {hasAfter && (
        <div className="after" onClick={() => navigate(`/?page=${page - 1}`)}>
          <span className="after-text">
            &::after
          </span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
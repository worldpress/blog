import * as React from 'react';
import _ from 'lodash/fp';
import format from 'date-fns/format';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

import useAllBlogPost from '../../../hooks/useAllBlogPost';
import { getArchivesGroupByMonth } from '../../../utils';

import '../../../assets/styles/widget.scss';
import './index.scss';

library.add(faCaretRight);

interface IArchivesProps {
  size: number;
}

const Archives = (props: IArchivesProps) => {
  const { size } = props;
  const archives = getArchivesGroupByMonth(useAllBlogPost());

  return (
    <div className="widget archives">
      <h3 className="widget-title">
        &lt;归档 /&gt;
      </h3>
      <div className="widget-content">
        {archives.slice(0, size).map(({ month, count }) => (
          <div className="archive-item" key={month}>
            <Link
              className="archive-item__link"
              to={`/arvhive/${month}`}
            >
              <FontAwesomeIcon
                className="archive-item__icon"
                icon="caret-right"
              />
              <span className="archive-item__text">
                <span className="archive-item-month">
                  {format(month, 'YYYY年MM月')}
                </span>
                <span className="archive-item-count">
                  ({count})
                </span>
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

Archives.defaultProps = {
  size: 6,
};

export default Archives;

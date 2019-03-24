import * as React from 'react';
import _ from 'lodash/fp';
import format from 'date-fns/format';
import { Link } from 'gatsby';
import { FaCaretRight } from 'react-icons/fa';

import './index.scss';
import { groupByDateFromPost } from '../../utils/helpers';

interface IArchivesWidgetProps {
  size: number;
  posts: IMarkdownRemarkNode[];
}

const ArchivesWidget = (props: IArchivesWidgetProps) => {
  const { size, posts } = props;
  const archiveGroup = groupByDateFromPost(posts);

  return (
    <div className="widget archives">
      <h3 className="widget-title">
        &lt;归档 /&gt;
      </h3>
      <div className="widget-content">
        {_.keys(archiveGroup).slice(0, size).map((date: string) => (
          <div className="archive-item" key={date}>
            <Link
              className="archive-item__link"
              to={`/arvhive/${date}`}
            >
              <span className="archive-item__icon">
                <FaCaretRight />
              </span>
              <span className="archive-item__text">
                <span className="archive-item__month">
                  {format(date, 'YYYY年MM月')}
                </span>
                <span className="archive-item__count">
                  ({_.size(archiveGroup[date])})
                </span>
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

ArchivesWidget.defaultProps = {
  size: 6,
  posts: [],
};

export default ArchivesWidget;

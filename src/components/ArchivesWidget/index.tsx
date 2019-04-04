import * as React from 'react';
import _ from 'lodash/fp';
import format from 'date-fns/format';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { FaCaretRight } from 'react-icons/fa';

import { groupByDateFromNodes, getMarkdownRemarkEdgeNode } from '../../utils/helpers';
import { DATE_SYMBOL } from '../../consts';
import './index.scss';

interface IArchivesWidgetProps {
  size: number;
}

const ArchivesWidget = (props: IArchivesWidgetProps) => {
  const { size } = props;

  const data = useStaticQuery(graphql`
    query GetAllBlogArchives {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              date
              title
            }
          }
        }
      }
    }
  `);
  const nodes = getMarkdownRemarkEdgeNode(data);
  const archiveGroup = groupByDateFromNodes(nodes);

  return (
    <div className="widget archives">
      <h3 className="widget-title">
        归档
      </h3>
      <div className="widget-content">
        {archiveGroup.slice(0, size).map(([date, posts]: [string, IMarkdownRemarkNode[]]) => (
          <div className="archive-item" key={date}>
            <Link
              className="archive-item__link"
              to={`/search?keyword=${DATE_SYMBOL} ${date}`}
            >
              <span className="archive-item__icon">
                <FaCaretRight />
              </span>
              <span className="archive-item__text">
                <span className="archive-item__month">
                  {format(date, 'YYYY年MM月')}
                </span>
                <span className="archive-item__count">
                  ({_.size(posts)})
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
  size: 12,
  posts: [],
};

export default ArchivesWidget;

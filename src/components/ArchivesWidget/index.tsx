import * as React from 'react';
import _ from 'lodash/fp';
import format from 'date-fns/format';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { FaCaretRight } from 'react-icons/fa';

import './index.scss';
import { groupByDateFromPost, getMarkdownRemarkEdgeNode } from '../../utils/helpers';

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
  const archiveGroup = groupByDateFromPost(getMarkdownRemarkEdgeNode(data));

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
              to={`/search?keyword=@date: ${date}`}
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
  size: 12,
  posts: [],
};

export default ArchivesWidget;

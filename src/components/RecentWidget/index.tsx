import * as React from 'react';
import format from 'date-fns/format';
import { Link } from 'gatsby';

import { formatPostDate } from '../../utils/helpers';
import './index.scss';

interface IRecentWidgetProps {
  size: number;
  posts: IMarkdownRemarkNode[];
}

const RecentWidget = (props: IRecentWidgetProps) => {
  const { size, posts } = props;

  return (
    <div className="widget recent">
      <h3 className="widget-title">
        &lt;最新文章 /&gt;
      </h3>
      <div className="widget-content">
        {posts.slice(0, size).map((post) => {
          const { id, frontmatter: { date, title } } = post;
          const postLink = `/${date}/${title}`;

          return (
            <div className="recent-item" key={id}>
              <Link
                className="recent-item__link"
                to={postLink}
              >
                <span className="recent-item__date">
                  {formatPostDate(date)}
                </span>
                <span className="recent-item__title">
                  {title}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

RecentWidget.defaultProps = {
  size: 5,
  posts: [],
};

export default RecentWidget;

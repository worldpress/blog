import * as React from 'react';
import _ from 'lodash/fp';
import { Link, useStaticQuery, graphql } from 'gatsby';

import { collectTagNamesFromPost, getMarkdownRemarkEdgeNode } from '../../utils/helpers';
import { TAG_SYMBOL } from '../../consts';
import './index.scss';

interface ITagsWidgetProps {
  size: number;
  posts: IMarkdownRemarkNode[];
}

const TagsWidget = (props: ITagsWidgetProps) => {
  const { size } = props;
  const data = useStaticQuery(graphql`
    query GetAllBlogTags {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              tags
            }
          }
        }
      }
    }
  `);
  const tagNames = collectTagNamesFromPost(getMarkdownRemarkEdgeNode(data));

  return (
    <div className="widget tags">
      <h3 className="widget-title">
        &lt;标签 /&gt;
      </h3>
      <div className="widget-content">
        {tagNames.slice(0, size).map((name: string) => (
          <div className="tag-item" key={name}>
            <Link
              className="tag-item__link"
              to={`/search?keyword=${TAG_SYMBOL} ${name}`}
            >
              <span className="tag-item__text">
                {name}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

TagsWidget.defaultProps = {
  size: 20,
};

export default TagsWidget;

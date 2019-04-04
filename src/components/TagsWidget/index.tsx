import * as React from 'react';
import _ from 'lodash/fp';
import { FaHashtag } from 'react-icons/fa';
import { Link, useStaticQuery, graphql } from 'gatsby';

import { getMarkdownRemarkEdgeNode, collectTagNamesFromNodes } from '../../utils/helpers';
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
  const nodes = getMarkdownRemarkEdgeNode(data);
  const tagNames = collectTagNamesFromNodes(nodes);

  return (
    <div className="widget tags">
      <h3 className="widget-title">
        标签
      </h3>
      <div className="widget-content">
        {tagNames.slice(0, size).map((name: string) => (
          <div className="tag-item" key={name}>
            <Link
              className="tag-item__link"
              to={`/search?keyword=${TAG_SYMBOL} ${name}`}
            >
              <span className="tag-item__text">
                <FaHashtag className="tag-item__icon" />
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

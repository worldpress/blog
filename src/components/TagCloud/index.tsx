import * as React from 'react';
import * as _ from 'lodash/fp';
import { Link } from 'gatsby';

import useAllBlogTags from '../../hooks/useAllBlogTags';

import '../../assets/styles/widget.scss';
import './index.scss';

interface ITagCloudProps {
  size: number;
};

const TagCloud = (props: ITagCloudProps) => {
  const { size } = props;
  const tags = useAllBlogTags();
  const sortTagNames = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);

  return (
    <div className="widget tag-cloud">
      <h3 className="widget-title tag-cloud-title">
        标签云
      </h3>
      <div className="widget-content">
        {sortTagNames.slice(0, size).map(tag => (
          <Link
            className="tag-item__link"
            key={tag}
            to={`/tag/${tag}`}
          >
            <span className="tag-item__text">
              {tag}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

TagCloud.defaultProps = {
  size: 20,
};

export default TagCloud;
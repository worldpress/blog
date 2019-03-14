import * as React from 'react';
import { Link } from 'gatsby';

import useAllBlogTags from '../../hooks/useAllBlogTags';

import './index.scss';

interface ITagCloudProps {
  size: number;
};

const TagCloud = (props: ITagCloudProps) => {
  const { size } = props;
  const tags = useAllBlogTags();

  return (
    <div className="tag-cloud">
      <h3 className="tag-cloud-title">
        标签云
      </h3>
      <div className="tag-cloud-content">
        {tags.slice(0, size).map(tag => (
          <Link
            className="tag-cloud-item__link"
            key={tag}
            to={`/tag/${tag}`}
          >
            <span className="tag-cloud-item__text">
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
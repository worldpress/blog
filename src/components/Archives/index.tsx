import * as React from 'react';

import useAllBlogArchives from '../../hooks/useAllBlogArichives';

import '../../assets/styles/widget.scss';
import './index.scss';

const Archives = () => {
  const archives = useAllBlogArchives();

  return (
    <div className="widget archives">
      <h3 className="widget-title">
        归档
      </h3>
    </div>
  );
};

export default Archives;
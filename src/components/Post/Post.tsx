import * as React from 'react';
import classnames from 'classnames';
import withStyles from 'react-jss';

import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostFooter from './PostFooter';
import PostContext from './context';

import { getPostLink } from '../../utils/helpers';

interface IPostDetailProps {
  post: IMarkdownRemarkNode;
  simple?: boolean;
}

const styles = theme => ({
  'post': {
    paddingBottom: '10px',

    '&.simple': {
      marginBottom: '20px',
      paddingBottom: '30px',
      borderBottom: theme.border,

      'post-header': {
        marginTop: '0',
      },

      '&:last-child': {
        borderBottom: 'none',
      },
    }
  }
});

const Post = (props: IPostDetailProps) => {
  const { post, simple } = props;
  const link: string = getPostLink(post);

  const postContext = {
    ...post,
    link,
    simple,
  };

  const clazz = classnames({
    post: true,
    simple,
  });

  return (
    <PostContext.Provider value={postContext}>
      <article className={clazz}>
        <PostHeader />
        <PostContent />
        <PostFooter />
      </article>
    </PostContext.Provider>
  );
};

Post.defaultProps = {
  simple: false,
};

export default withStyles(styles)(Post);


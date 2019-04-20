import * as React from 'react';
import classnames from 'classnames';
import withStyles, { WithStyles } from 'react-jss';

import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostFooter from './PostFooter';
import PostContext from './context';

import { getPostLink } from '../../utils/helpers';

const styles = (theme) => ({
  post: {
    paddingBottom: '10px',
  },
  simple: {
    marginBottom: '20px',
    paddingBottom: '30px',
    borderBottom: theme.defaultBorder,

    '&:last-child': {
      borderBottom: 'none',
    },
  },
});

type IPostProps = WithStyles<typeof styles> & {
  post: IMarkdownRemarkNode;
  simple?: boolean;
}

const Post = (props: IPostDetailProps) => {
  const { classes, post, simple } = props;
  const link: string = getPostLink(post);

  const postContext = {
    ...post,
    link,
    simple,
  };

  const articleClassName = classnames(classes.post, {
    [classes.simple]: simple,
  });

  return (
    <PostContext.Provider value={postContext}>
      <article className={articleClassName}>
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

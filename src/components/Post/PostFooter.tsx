import * as React from 'react';
import { Link } from 'gatsby';
import { FaHashtag } from 'react-icons/fa';
import withStyles, { WithStyles } from 'react-jss';

import PostContext, { IPostContext } from './context';
import { TAG_SYMBOL } from '../../consts';

const styles = (theme) => ({
  footer: {
    paddingTop: '15px',
    borderTop: theme.defaultBorder,
  },
  tagList: {
    marginBottom: '10px',
  },
  tag: {
    color: theme.themeColor,
    marginRight: '10px',
  },
  icon: {
    fontSize: '0.85em',
    marginRight: '2px',
  },
  link: {
    boxShadow: 'none',
  }
});

type IPostFooterPorps = WithStyles<typeof styles>

const PostFooter = (props: IPostFooterPorps) => {
  const { classes } = props;
  const post = React.useContext(PostContext) as IPostContext;
  const { simple, frontmatter: { tags } } = post;

  if (simple) {
    return null;
  }

  return (
    <div className={classes.footer}>
      <div className={classes.tagList}>
        {tags.map((name) => (
          <span className={classes.tag} key={name}>
            <span className={classes.icon}>
              <FaHashtag />
            </span>
            <Link
              className={classes.link}
              to={`/search?keyword=${TAG_SYMBOL} ${name}`}
            >
              {name}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
};

export default withStyles(styles)(PostFooter);

import * as React from 'react';
import { Link } from 'gatsby';
import withStyles, { WithStyles, jss } from 'react-jss';
import Color from 'color';

import PostContext, { IPostContext } from './context';

const styles = (theme) => ({
  excerpt: {
    margin: '10px 0 20px',
    color: Color(theme.blackColor).lighten(0.75).hex(),
    fontSize: '1em',
  },
  readMore: {
    fontSize: '16px',
    color: theme.themeColor,
  },
  link: {
    color: 'inherit',
    boxShadow: 'none',
    '&:hover': {
      color: Color(theme.themeColor).lighten(0.05).hex(),
    }
  },
  markdown: {
    '& code': {
      fontSize: '0.85em',
    },
    '& .anchor': {
      boxShadow: 'none',
    },
    '& .gatsby-highlight': {
      margin: '30px 0',
      '& pre': {
        borderRadius: '5px',
      },
    },
  },
});

type IPostContextPorps = WithStyles<typeof styles>

const PostContent = (props: IPostContextPorps) => {
  const { classes } = props;
  const post = React.useContext(PostContext) as IPostContext;
  const { link, excerpt, html, simple } = post;

  return (
    <div>
      {simple ? (
        <div>
          <p className={classes.excerpt}>{excerpt}</p>
          <div className={classes.readMore}>
            <Link className={classes.link} to={link}>
              阅读更多...
            </Link>
          </div>
        </div>
      ) : (
        <div
          className={classes.markdown}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
};

export default withStyles(styles)(PostContent);

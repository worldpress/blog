import * as React from 'react';
import { Link } from 'gatsby';
import classnames from 'classnames';
import { FaCalendarAlt, FaClock  } from 'react-icons/fa';
import withStyles, { WithStyles } from 'react-jss';
import Color from 'color';

import PostContext, { IPostContext } from './context';
import { formatPostDate, formatReadingTime } from '../../utils/helpers';

const styles = (theme) => ({
  header: {
    margin: '20px 0',
  },
  simple: {
    margin: '20px 0 10px',
  },
  title: {
    margin: '15px 0 10px',
    fontSize: '32px',
    fontWeight: '400',
    color: theme.themeColor,
  },
  link: {
    color: 'inherit',
    fontSize: '28px',
    textDecoration: 'none',
    boxShadow: 'none',

    '&:hover': {
      color: Color(theme.themeColor).lighten(0.05).hex(),
    }
  },
  meta: {
    color: theme.garyColor,
  },
  item: {
    marginRight: '10px',
  },
  icon: {
    position: 'relative',
    top: '1px',
    marginRight: '5px',
    fontSize: '0.75em',
  },
});

type IPostHeaderProps = WithStyles<typeof styles>

const PostHeader = (props: IPostHeaderProps) => {
  const { classes } = props;
  const post = React.useContext(PostContext) as IPostContext;
  const { simple, link, timeToRead, frontmatter: { title, date } } = post;

  const headerClassNames = classnames(classes.header, {
    [classes.simple]: simple,
  });

  return (
    <header className={headerClassNames}>
      {simple ? (
        <h2 className={classes.title}>
          <Link className={classes.link} to={link}>
            {title}
          </Link>
        </h2>
      ) : (
        <h2 className={classes.title}>
          {title}
        </h2>
      )}
      <div className={classes.meta}>
        <span className={classes.item}>
          <span className={classes.icon}>
            <FaCalendarAlt />
          </span>
          {formatPostDate(date)}
        </span>
        <span className={classes.item}>
          <span className={classes.icon}>
            <FaClock />
          </span>
          {formatReadingTime(timeToRead)}
        </span>
      </div>
    </header>
  );
};

export default withStyles(styles)(PostHeader);

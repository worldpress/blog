import * as React from 'react';
import withStyles, { WithStyles } from 'react-jss';
import _ from 'lodash/fp';

const styles = (theme) => ({
  wrapper: {
    position: 'relative',
    margin: '20px 0 30px',
    borderBottom: theme.defaultBorder,
  },
  input: {
    height: '60px',
    width: 'calc(100% - 50px)',
    padding: '0',
    fontSize: '40px',
    color: theme.blackColor,
    border: 'none',
    outline: 'none',
    '&::placeholder': {
      color: theme.garyColor,
      fontWeight: '200',
    },
  },
  count: {
    fontSize: '40px',
    lineHeight: '60px',
    color: theme.garyColor,
  },
});

type ISearchInputProps = WithStyles<typeof styles> & {
  value: string;
  count: number;
  onChange: any;
}

const SearchInput = (props: ISearchInputProps) => {
  const { classes, value, count, onChange } = props;
  const inputEl = React.useRef(null);

  const handleSearchChange = (e: React.ChangeEvent) => {
    // @ts-ignore
    const val = e.currentTarget.value;
    onChange(val);
  };

  React.useEffect(() => {
    inputEl.current.focus();
  }, []);

  return (
    <div className={classes.wrapper}>
      <input
        type="text"
        ref={inputEl}
        className={classes.input}
        placeholder="站内搜索"
        value={value}
        onChange={handleSearchChange}
      />
      {!_.isEmpty(value) && (
        <span className={classes.count}>
          {count}
        </span>
      )}
    </div>
  );
};

export default withStyles(styles)(SearchInput);

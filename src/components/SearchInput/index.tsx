import * as React from 'react';
import _ from 'lodash/fp';

import './index.scss';

interface ISearchInputProps {
  value: string;
  count: number;
  onChange: any;
}

const SearchInput = (props: ISearchInputProps) => {
  const { value, count, onChange } = props;
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
    <div className="search-input">
      <input
        type="text"
        ref={inputEl}
        className="input"
        placeholder="站内搜索"
        value={value}
        onChange={handleSearchChange}
      />
      {!_.isEmpty(value) && (
        <span className="count">
          {count}
        </span>
      )}
    </div>
  );
};

export default SearchInput;

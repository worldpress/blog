import * as React from 'react';

import './index.scss';

interface ISearchInputProps {
  value: any;
  onChange: any;
}

const SearchInput = (props: ISearchInputProps) => {
  const { value, onChange } = props;

  const handleSearchChange = (e: React.ChangeEvent) => {
    // @ts-ignore
    const val = e.currentTarget.value;
    onChange(val);
  };

  return (
    <div className="search">
      <input
        type="text"
        className="search-input"
        placeholder="站内搜索"
        value={value}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchInput;

import * as React from 'react';

import './index.scss';

interface ISearchInputProps {
  value: any;
  onChange: any;
}

const SearchInput = (props: ISearchInputProps) => {
  const { value, onChange } = props;
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
    <div className="search">
      <input
        type="text"
        ref={inputEl}
        className="search-input"
        placeholder="站内搜索"
        value={value}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchInput;

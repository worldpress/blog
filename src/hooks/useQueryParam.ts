import { useState, useEffect } from 'react';
import { createBrowserHistory } from 'history';
import queryString from 'query-string';
import _ from 'lodash/fp';

const useQueryParam = (key: string) => {
  const history = createBrowserHistory();
  const params = queryString.parse(history.location.search);
  const [param, setParam] = useState(params[key]);

  useEffect(() => {
    const newParams = {
      ...queryString.parse(history.location.search),
      [key]: param,
    };
    history.replace('?' + queryString.stringify(newParams));
  }, [key, param]);

  return [param, setParam];
};

export default useQueryParam;

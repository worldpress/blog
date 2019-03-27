import { useState, useEffect } from 'react';
import { replace } from 'gatsby';
import queryString from 'query-string';
import _ from 'lodash/fp';

const useQueryParam = (location: Location, key: string) => {
  const { pathname, search } = location;
  const params = queryString.parse(search);
  const [param, setParam] = useState(params[key]);

  useEffect(() => {
    const newParams = _.pickBy(_.identity, {
      ...queryString.parse(location.search),
      [key]: param,
    });
    console.log(location);
    console.log(newParams);
    if (_.isEmpty(newParams)) {
      replace(pathname);
    } else {
      replace(`${pathname}?` + queryString.stringify(newParams));
    }
  }, [pathname, key, param]);

  return [param, setParam];
};

export default useQueryParam;

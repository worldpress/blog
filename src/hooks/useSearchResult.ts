import { useState, useEffect } from 'react';
import format from 'date-fns/format';
import _ from 'lodash/fp';

import { TAG_SYMBOL, DATE_SYMBOL } from '../consts';

const useSearchResult = (preset: IMarkdownRemarkNode[], keyword: string) => {
  const [result, setResult] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (keyword === '') {
        setResult([]);
        return;
      }
      const searchResult = _.filter((node: IMarkdownRemarkNode) => {
        const tags = _.get('frontmatter.tags', node) || [];
        const date = _.get('frontmatter.date', node);
        const title = _.toLower(_.get('frontmatter.title', node));
        const rawMarkdownBody = _.toLower(_.get('rawMarkdownBody', node));

        if (_.startsWith(TAG_SYMBOL, keyword)) {
          const searchTag = _.toLower(_.trim(keyword.replace(TAG_SYMBOL, '')));
          return _.includes(searchTag, _.map(_.toLower, tags));
        }
        if (_.startsWith(DATE_SYMBOL, keyword)) {
          const searchDate = _.trim(keyword.replace(DATE_SYMBOL, ''));
          if (/^\d{4}$/.test(searchDate)) {
            return format(searchDate, 'YYYY') === format(date, 'YYYY');
          }
          if (/^\d{4}\/\d{1,2}$/.test(searchDate)) {
            return format(searchDate, 'YYYY/MM') === format(date, 'YYYY/MM');
          }
          if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(searchDate)) {
            return format(searchDate, 'YYYY/MM/DD') === format(date, 'YYYY/MM/DD');
          }
          return false;
        }

        const searchKeyword = _.toLower(_.trim(keyword));
        return _.includes(searchKeyword, title) || _.includes(searchKeyword, rawMarkdownBody);
      }, preset);
      setResult(searchResult);
    }, 600);

    return () => clearTimeout(handler);
  }, [keyword]);

  return result;
};

export default useSearchResult;

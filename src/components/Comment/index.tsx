import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
// @ts-ignore
import Gitalk from 'gitalk';
import _ from 'lodash/fp';

import 'gitalk/dist/gitalk.css';
import './index.scss';

interface ICommentProps {
  id: number;
}

const Commemt = (props: ICommentProps) => {
  const { id } = props;

  if (!id) {
    return null;
  }

  const data = useStaticQuery(graphql`
    query GetSiteGitalk {
      site {
        siteMetadata {
          gitalk {
            clientID
            clientSecret
            repo
            owner
          }
        }
      }
    }
  `);
  const options: ISiteGitalk = _.get('site.siteMetadata.gitalk', data);

  React.useEffect(() => {
    const gitalk = new Gitalk({
      clientID: options.clientID,
      clientSecret: options.clientSecret,
      repo: options.repo,
      owner: options.owner,
      admin: [options.owner],
      id: location.pathname,
      number: id,
      distractionFreeMode: false,
    });

    gitalk.render('comment');
  }, [id]);

  return <div id="comment" />;
};

export default Commemt;

import { useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
// @ts-ignore
import Gitalk from 'gitalk';
import _ from 'lodash/fp';

const useGitalk = (elemantId: string, issueId: number) => {
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

  useEffect(() => {
    const gitalk = new Gitalk({
      clientID: options.clientID,
      clientSecret: options.clientSecret,
      repo: options.repo,
      owner: options.owner,
      admin: [options.owner],
      id: location.pathname,
      number: issueId,
      distractionFreeMode: false,
    });
    gitalk.render(elemantId);
  }, []);
};

export default useGitalk;

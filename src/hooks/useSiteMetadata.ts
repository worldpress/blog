import * as _ from 'lodash/fp';
import { useStaticQuery, graphql } from 'gatsby';

const useSiteMetadata = (): ISiteMetadata => {
  const { site } = useStaticQuery(graphql`
    query GetSiteMetadata {
      site {
        siteMetadata {
          title
          since
          author
          menu {
            name
            path
          }
          socials {
            name
            link
          }
          friends {
            name
            link
          }
        }
      }
    }
  `);

  return _.get('siteMetadata', site);
};

export default useSiteMetadata;

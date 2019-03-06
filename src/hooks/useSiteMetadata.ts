import * as _ from 'lodash/fp';
import { useStaticQuery, graphql } from 'gatsby';

interface ISiteMenuItem {
  name: string;
  path: string;
}

interface ISiteMetaLink {
  name: string;
  link: string;
}

interface ISiteMetadata {
  title: string;
  since: number;
  author: string;
  menu: ISiteMenuItem[];
  socials: ISiteMetaLink[];
  friends: ISiteMetaLink[];
}

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

import * as React from 'react';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import _ from 'lodash/fp';

interface ISEOProps {
  lang: string;
  slug: string;
  meta: any[];
  title: string;
  description: string;
}

const SEO = (props: ISEOProps) => {
  const { lang, slug, title, description, meta } = props;
  const data = useStaticQuery(graphql`
    query GetSEOMetadata {
      site {
        siteMetadata {
          title
          author
          description
          siteUrl
          twitter
          socials {
            name
            link
          }
        }
      }
    }
  `);
  const metadata = _.get('site.siteMetadata', data);
  const metaTitle = title ? `${title} - ${metadata.title}` : metadata.title;
  const metaDescription = description || metadata.description;
  const metaTwitter = metadata.twitter;

  const url = `${metadata.siteUrl}${slug}`;

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={metaTitle}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:url',
          content: url,
        },
        {
          property: 'og:title',
          content: metaTitle,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:creator',
          content: metaTwitter,
        },
        {
          name: 'twitter:title',
          content: metaTwitter,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
        ...meta,
      ]}
    />
  );
};

SEO.defaultProps = {
  lang: 'zh-cn',
  slug: '',
  title: '',
  description: '',
  meta: [],
};

export default SEO;

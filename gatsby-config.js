'use strict';

require('source-map-support').install();
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
});

module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: `Ahonn's Blog`,
    author: 'Ahonn',
    description: 'Personal blog by Ahonn.',
    siteUrl: 'https://www.ahonn.me',
    since: 2015,
    twitter: '@ahonnjiang',
    menu: [
      // { name: '首页', path: '/' },
      // { name: '关于我', path: '/about' },
      { name: '搜索', path: '/search', header: true },
      { name: 'Wiki', path: 'https://wiki.ahonn.me', header: false },
      { name: 'RSS', path: 'https://www.ahonn.me/atom.xml', header: false },
    ],
    socials: [
      { name: 'Github', link: 'https://github.com/ahonn' },
      { name: 'Twitter', link: 'https://twitter.com/ahonnjiang' },
      { name: 'Zhihu', link: 'https://www.zhihu.com/people/ahonn/activities' },
    ],
    friends: [
      { name: 'yzzting', link: 'http://yzz1995.cn/' },
      { name: 'colmugx', link: 'https://colmugx.github.io/blog/' },
    ],
    gitalk: {
      clientID: 'af04686863d8fe77f3b3',
      clientSecret: '908c476e842511483d95125bf57c9669db71fe51',
      repo: 'blog',
      owner: 'ahonn',
    },
  },
  plugins: [
    {
      resolve: 'gatsby-source-github-issue',
      options: {
        owner: 'ahonn',
        repo: 'blog',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/posts`,
        name: 'markdown-posts',
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-74273646-1',
        optimizeId: 'GTM-PKS39F4',
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Ahonn's Blog`,
        short_name: `Ahonn's Blog`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#dc001c`,
        display: 'standalone',
        icon: `src/assets/icon.png`,
        theme_color_in_head: false,
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        exclude: ["/page/*", `/search`],
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: '/atom.xml',
            title: "Ahonn's Blog RSS Feed",
          },
        ],
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-responsive-iframe',
          'gatsby-remark-copy-linked-files',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              maintainCase: true,
              removeAccents: true,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {},
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require('sass'),
      },
    },
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-typescript',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
  ],
};

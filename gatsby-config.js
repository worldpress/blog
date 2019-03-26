'use strict';

require('source-map-support').install()
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
})

module.exports = {
  siteMetadata: {
    title: `Ahonn's Blog`,
    author: 'Richard Jiang',
    since: 2015,
    menu: [
      { name: '首页', path: '/' },
      { name: '关于我', path: '/about' },
    ],
    socials: [
      { name: 'zhihu', link: 'https://www.zhihu.com/people/ahonn/activities' },
      { name: 'twitter', link: 'https://twitter.com/ahonnjiang' },
      { name: 'github', link: 'https://github.com/ahonn' },
    ],
    friends: [
      { name: 'yzzting', link: 'http://yzz1995.cn/' },
      { name: 'colmugx', link: 'https://colmugx.github.io/blog/' },
    ],
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require('sass'),
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
      resolve: 'gatsby-source-github-issue',
      options: {
        owner: 'creeperyang',
        repo: 'blog',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-responsive-iframe',
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
            }
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
  ],
};

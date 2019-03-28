'use strict';

require('source-map-support').install()
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
})

module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: `Ahonn's Blog`,
    author: 'Richard Jiang',
    description: 'Personal blog by Ahonn Jiang.',
    siteUrl: 'https://www.ahonn.me',
    since: 2015,
    menu: [
      // { name: '首页', path: '/' },
      // { name: '关于我', path: '/about' },
      { name: '搜索', path: '/search' },
    ],
    socials: [
      { name: 'Github', link: 'https://github.com/ahonn' },
      { name: 'Twitter', link: 'https://twitter.com/ahonnjiang' },
      { name: 'Zhihu', link: 'https://www.zhihu.com/people/ahonn/activities' },
      { name: 'Wiki', link: 'https//wiki.ahonn.me' },
    ],
    friends: [
      { name: 'yzzting', link: 'http://yzz1995.cn/' },
      { name: 'colmugx', link: 'https://colmugx.github.io/blog/' },
    ],
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
    'gatsby-plugin-catch-links',
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
    'gatsby-plugin-typescript',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
  ],
};

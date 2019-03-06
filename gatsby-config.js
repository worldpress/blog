module.exports = {
  siteMetadata: {
    title: `Ahonn's Blog`,
    author: 'Richard Jiang',
    since: 2015,
    menu: [
      { name: 'Home', path: '/' },
      { name: 'Archives', path: '/archives' },
      { name: 'About', path: '/about' },
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
      resolve: 'gatsby-source-yuque-docs',
      options: {
        user: 'fe9',
        repo: 'select',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: `<!-- more -->`,
      },
    },
  ],
};

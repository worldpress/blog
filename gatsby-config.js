module.exports = {
  siteMetadata: {
    title: `Ahonn's Blog`,
    author: 'Richard Jiang',
    since: 2015,
    menu: [
      { name: '首页', path: '/' },
      { name: '所有文章', path: '/archives' },
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
        user: 'ahonn',
        repo: 'blog',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      // options: {
      //   excerpt_separator: `<!-- more -->`,
      // },
    },
  ],
};

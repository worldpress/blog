'use strict';

const path = require('path');

const PAGE_SIZE = 15;

function createIndexPages(actions, result) {
  const { createPage, createRedirect } = actions;

  const posts = result.data.allMarkdownRemark.edges;
  const total = posts.length;

  const pageTotal = Math.round(total / PAGE_SIZE);
  for (let page = 1; page <= pageTotal; page += 1) {
    console.log(`createPage: /page/${page}`);
    createPage({
      path: page === 1 ? '/' : `/page/${page}`,
      component: path.resolve('src/templates/blog-index.tsx'),
      context: {
        page,
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        total,
      },
    });
  }

  createRedirect({
    fromPath: '/page/1',
    toPath: '/',
    isPermanent: true,
    redirectInBrowser: true,
  });
}

function createPostPages(actions, result) {
  const { createPage } = actions;

  const posts = result.data.allMarkdownRemark.edges;
  posts.forEach(({ node }) => {
    const { id, frontmatter, fileAbsolutePath } = node;
    const { title, date } = frontmatter;

    const slug = title.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '');
    const postPath = `/${date}/${slug}/`;

    console.log(`createPage: ${postPath}`);
    createPage({
      path: postPath,
      component: path.resolve('src/templates/blog-post.tsx'),
      context: {
        id,
      },
    });

    // hexo post redirect
    if (fileAbsolutePath !== null) {
      const [, fileName] = fileAbsolutePath.match(/([^\\/]+)\.md$/);
      const redirectUrl = `/${date}/${fileName}/`;

      console.log(`createPage: ${redirectUrl}`);
      createPage({
        path: redirectUrl,
        component: path.resolve('src/templates/blog-post.tsx'),
        context: {
          id,
          redirect: true,
          redirectUrl: postPath,
        },
      });
    }
  });
}

module.exports = ({ actions, graphql }) => {
  return graphql(`
    {
      allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
        edges {
          node {
            id
            frontmatter {
              title
              date(formatString: "YYYY/MM/DD")
              tags
            }
            fileAbsolutePath
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()));
      return Promise.reject(result.errors);
    }
    createIndexPages(actions, result);
    createPostPages(actions, result);
  });
};

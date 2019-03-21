'use strict';

require('source-map-support').install();
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
});

const path = require('path');

module.exports = ({ actions, graphql }) => {
  const { createPage } = actions;

  return graphql(`
    {
      allMarkdownRemark(
        sort: { fields: frontmatter___date, order: DESC }
      ) {
        edges {
          node {
            id
            frontmatter {
              title
              date(formatString: "YYYY/MM/DD")
              tags
            }
            excerpt(truncate: true)
            rawMarkdownBody
            fileAbsolutePath
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()));
      return Promise.reject(result.errors);
    }

    const posts = result.data.allMarkdownRemark.edges;
    const tags = new Set();

    posts.forEach(({ node }) => {
      const { id, frontmatter } = node;
      const { title, date, tags } = frontmatter;

      const postPath = `/${date}/${title}`;

      createPage({
        path: postPath,
        component: path.resolve(`src/templates/post/index.tsx`),
        context: {
          id,
        },
      });
    });
  });

};

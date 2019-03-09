'use strict';

require('source-map-support').install();
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
});

const path = require('path');
const { format } = require('date-fns');

const { PageType } = require('./src/consts');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allYuqueDoc {
          edges {
            node {
              id
              slug
              created_at
            }
          }
        }
        allMarkdownRemark {
          edges {
            node {
              id
              fileAbsolutePath
              frontmatter {
                date
              }
            }
          }
        }
      }
    `).then(result => {
      const { allYuqueDoc, allMarkdownRemark } = result.data;

      allYuqueDoc.edges.forEach(({ node }) => {
        const { id, slug, created_at } = node;
        const date = format(created_at, 'YYYY/MM/DD');
        const pagePath = `/${date}/${slug}`;

        createPage({
          path: pagePath,
          component: path.resolve(`./src/templates/post.tsx`),
          context: {
            id,
            type: PageType.Yuque,
          },
        });
      });

      allMarkdownRemark.edges.forEach(({ node }) => {
        const { id, frontmatter, fileAbsolutePath } = node;
        if (fileAbsolutePath !== null) {
          const date = format(frontmatter.date, 'YYYY/MM/DD');

          const lastSlashIndex = fileAbsolutePath.lastIndexOf('/');
          const mdExtIndex = fileAbsolutePath.lastIndexOf('.md');
          const slug = fileAbsolutePath.substring(lastSlashIndex + 1, mdExtIndex);

          const pagePath = `/${date}/${slug}`;

          createPage({
            path: pagePath,
            component: path.resolve(`./src/templates/post.tsx`),
            context: {
              id,
              type: PageType.Markdown,
            },
          });
        }
      });

      resolve();
    });
  });
};

const format = require('date-fns/format');

module.exports = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const { frontmatter } = node;

    const title = frontmatter.title.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '');
    const date = format(frontmatter.date, 'YYYY/MM/DD');

    createNodeField({
      node,
      name: 'slug',
      value: `/${date}/${title}/`,
    });
  }
};

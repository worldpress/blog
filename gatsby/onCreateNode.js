const format = require('date-fns/format');

module.exports = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const { frontmatter } = node;

    const date = format(frontmatter.date, 'YYYYMMDD');
    const slug = `/posts/${date}${frontmatter.issueId}`;

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

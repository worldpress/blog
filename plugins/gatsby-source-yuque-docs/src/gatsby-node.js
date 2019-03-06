const assert = require('assert');

const YuqueDocs = require('./yuque-docs');

exports.sourceNodes = async (context, pluginOptions) => {
  const { actions, createNodeId, createContentDigest } = context;
  const { createNode } = actions;
  const { user, repo } = pluginOptions;

  assert(user, 'user options is required');
  assert(repo, 'repo options is required');

  const yd = new YuqueDocs(user, repo);

  const docs = await yd.fetchAllDocs();

  docs.forEach(doc => {
    createNode({
      ...doc,
      id: createNodeId(`yuque-doc-${doc.id}`),
      parent: null,
      children: [],
      internal: {
        type: 'YuqueDoc',
        mediaType: 'text/markdown',
        content: doc.body,
        contentDigest: createContentDigest(doc),
      },
    });
  });

  return;
}

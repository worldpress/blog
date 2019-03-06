const axios = require('axios');

const YUQUE_API = 'https://www.yuque.com/api/v2';
const YUQUE_REPO_DOCS_URL = `${YUQUE_API}/repos/:namespace/docs`;
const YUQUE_REPO_DOC_URL = `${YUQUE_API}/repos/:namespace/docs/:slug`;

class YuqueDocs {
  constructor(user, repo) {
    this.namespace = `${user}/${repo}`;
  }

  async fetchAllDocs() {
    const docsUrl = YUQUE_REPO_DOCS_URL.replace(':namespace', this.namespace);
    const docsResponse = await axios.get(docsUrl);
    const docRequests = docsResponse.data.data.map(({ slug }) => this.fetchDocBySlug(slug));
    const docs = await Promise.all(docRequests);
    return docs;
  }

  async fetchDocBySlug(slug) {
    const docUrl = YUQUE_REPO_DOC_URL.replace(':namespace', this.namespace).replace(':slug', slug);
    const docResponse = await axios.get(docUrl, {
      params: {
        raw: 1, // return markdown raw content
      }
    });
    return docResponse.data.data;
  }
}

module.exports = YuqueDocs;
import { format } from 'date-fns';
import { IMarkdownFile, IYuqueDoc } from './hooks/useAllBlogPost';

export function getDocumentScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop;
}

export function getYuqueDocLink(yuqueDoc: IYuqueDoc) {
  const { slug, created_at } = yuqueDoc;
  const date = format(created_at, 'YYYY/MM/DD');
  return `/${date}/${slug}`;
}

export function getMarkdownPostLink(markdownFile: IMarkdownFile) {
  const { frontmatter, fileAbsolutePath } = markdownFile;
  const date = format(frontmatter.date, 'YYYY/MM/DD');

  const lastSlashIndex = fileAbsolutePath.lastIndexOf('/');
  const mdExtIndex = fileAbsolutePath.lastIndexOf('.md');
  const slug = fileAbsolutePath.substring(lastSlashIndex + 1, mdExtIndex);

  return `/${date}/${slug}`;
}
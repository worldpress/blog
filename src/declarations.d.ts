declare const graphql: (query: TemplateStringsArray) => void

declare interface IMarkdownFile {
  id: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
  };
  excerpt: string;
  rawMarkdownBody: string;
  fileAbsolutePath: string | null;
}

declare interface IBlogPost {
  id: string;
  title: string;
  tags: string[];
  excerpt: string;
  body: string;
  created_at: string;
  updated_at: string;
}
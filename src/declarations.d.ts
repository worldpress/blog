declare const graphql: (query: TemplateStringsArray) => void;

declare interface ISiteMenuItem {
  name: string;
  path: string;
}

declare interface ISiteMetaLink {
  name: string;
  link: string;
}

declare interface ISiteMetadata {
  title: string;
  since: number;
  author: string;
  menu: ISiteMenuItem[];
  socials: ISiteMetaLink[];
  friends: ISiteMetaLink[];
}

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

declare interface IBlogTags {
  name: string;
  count: number;
  posts: IBlogPost[];
}

declare interface IBlogArchives {
  month: string;
  count: number;
  posts: IBlogPost[];
}

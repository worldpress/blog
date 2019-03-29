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

declare interface IMarkdownRemark {
  edges: IMarkdownRemarkEdge[];
}

declare interface IMarkdownRemarkEdge {
  node: IMarkdownRemarkNode;
}

declare interface IMarkdownRemarkNode {
  id: number;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    issueId: number;
  };
  excerpt: string;
  html: string;
  rawMarkdownBody: string;
  timeToRead: number;
}

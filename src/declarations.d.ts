declare const graphql: (query: TemplateStringsArray) => void;

declare interface ISiteMenuItem {
  name: string;
  path: string;
}

declare interface ISiteLink {
  name: string;
  link: string;
}

declare interface ISiteGitalk {
  clientID: string;
  clientSecret: string;
  repo: string;
  owner: string;
}

declare interface ISiteMetadata {
  title: string;
  since: number;
  author: string;
  menu: ISiteMenuItem[];
  socials: ISiteLink[];
  friends: ISiteLink[];
  gitalk: ISiteGitalk;
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

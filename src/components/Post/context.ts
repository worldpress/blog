import * as React from 'react';

export type IPostContext = IMarkdownRemarkNode & {
  link: string;
  simple: boolean;
}

const PostContent = React.createContext({});

export default PostContent;

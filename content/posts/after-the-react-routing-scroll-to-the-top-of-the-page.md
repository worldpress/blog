---
title: React 路由跳转后回到页面顶部
date: 2016-10-11 01:13:19
tags:
  - React
  - 前端
  - JavaScript
categories:
  - 技术文章
---

在 React 组件间进行页面跳转后，发现页面的位置并不在页面顶部，而是在页面跳转前的位置。就是说浏览器的滚动条并没有回到顶部的位置。

经过搜索之后找到了解决方案：[Scroll to the top of the page after render in react.js](http://stackoverflow.com/questions/33188994/scroll-to-the-top-of-the-page-after-render-in-react-js)

可以使用下面这种解决，但是这种方式不是一种很好的解决方法。而且 `scrollIntoView()` 方法并不回到页面的顶部，应该使用 `scrollTop = 0` 的方式。

``` js
componentDidUpdate = () => { ReactDom.findDOMNode(this).scrollIntoView(); }
```

所以得到的解决方案是：

``` js
componentDidUpdate() {
  ReactDOM.findDOMNode(this).scrollTop = 0
}
```

<!--more-->

但是我使用这个之后，ESlint 报了个错：`no-find-dom-node`。
查看 `eslint-plugin-react` 的[文档](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md)可以看到 Facebook 不推荐使用 `findDOMNode`，推荐使用 `refs` 获取 DOM 节点。

所以推荐的使用方法是：

``` js
class MyComponent extends Component {
  componentDidMount() {
    this.node.scrollIntoView();
  }
  render() {
    return <div ref={node => this.node = node} />
  }
}
```

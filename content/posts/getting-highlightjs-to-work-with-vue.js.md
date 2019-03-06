---
title: Vue 中使用 highlight.js
date: 2016-07-13 12:08:30
tags:
  - Vue
  - 前端
categories:
  - 思考总结
---

今天遇到一个问题：在使用 vue 的练手项目中，渲染的 HTML 里 `<code>` 标签中的代码没有代码高亮。

遂想到用 highlight.js 来解决，按照平常那样在 HTML 文件中引入 `js` 和 `css` 文件，然后在`<header>` 中加上一句 `<script>hljs.initHighlightingOnLoad();</script>`。但是却没有效果。

在 Vue.js 的论坛上找到了解决方案 [Getting highlightjs to work with vue-router](https://forum.vuejs.org/topic/3514/getting-highlightjs-to-work-with-vue-router)。highlight.js 没有效果是因为使用了 `vue-route`，在 route 改变时，页面将会重新渲染并且会移除事件，这里就把 highlight 的事件给移除了。
<!--more-->

## Solution
所以得到的解决方案是，使用 Vue.js 的自定义指令，定义一个叫做 `v-highlight` 的指令来使得 `<pre><code> .. </code></pre>` 中的代码高亮。

定义自定义指令：
``` js
import Hljs from 'highlight.js'

Vue.directive('highlightjs', function() {
  let blocks = this.el.querySelectorAll('pre code');
  Array.prototype.forEach.call(blocks, Hljs.highlightBlock);
})
```

这里 import 了 highlight.js，所以需要 `npm install highlight.js`。导入之后使用 `Vue.directive()` 定义 `v-highlightjs` 指令，获取使用该指令的 document 中的 `pre  code` 部分，并使用 highlight.js 的 `highlightBlock` 使其高亮。

## How to use
之后在需要高亮的地方，使用 `v-highlightjs` 指令即可用使得其中的 `<pre><code> .. </code></pre>` 部分高亮。

``` html
<div v-html="your_content" v-highlightjs>
</div>
```

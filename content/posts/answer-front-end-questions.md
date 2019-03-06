---
title: 答前端面试题
date: 2017-03-11 17:13:46
tags:
  - 前端
  - 面试
categories:
  - 思考总结
---

> 答 [中级前端工程师面试 我想问的几个问题](https://zhuanlan.zhihu.com/p/25701897) 中的几个问题，感谢 [@SimplyY
](https://www.zhihu.com/people/simplyy/answers)

## 我最大的优势以及为什么选择前端

- 我最大的优势是自学能力与理解能力强，并且不给自己套上『我是前端程序员』的枷锁，对于所有技术保持好奇心，不畏惧舒适圈外的事物并敢于尝试。
- 选择前端的理由是，前端能够迅速的把想法实现，可选技术栈广泛（Web，移动端，桌面客户端），也是前端的优点之一。

<!--more-->

## 前后端分离的原理及意义
后端提供数据接口，前端获取数据并呈现。
### 前后端分离的意义
- 后端无须套模版，前后端解耦。
- 提高工作效率，前后端同步开发。

## 对 react 的理解与相对于 jQuery 开发的优势
### 对 React 的理解
  - 通过 Virtual DOM 和 Diff 算法隔离 DOM 操作。
  - 采用单向数据流，数据流动方向单一，可跟踪。
  - 组件化，JSX 自定义标签，便于抽象化。

### 对比 jQuery 开发的优势
- 无需直接操作 DOM，事件通过改变 state 间接操作 DOM。

![React-vs-jQuery.png](https://ahonn-me.oss-cn-beijing.aliyuncs.com/images/lw0qj.jpg)


## 页面性能优化
> **页面生成过程**

>  - HTML代码转化为DOM
>  - CSS代码转化成CSSOM
>  - 结合DOM和CSSOM，生成一棵渲染树
>  - 生成布局（layout），即将所有渲染树的所有节点进行平面合成
>  - 将布局绘制（paint）在屏幕上

- 减少 HTTP 请求（合并 CSS/JS，小于 10k 的图片 base64）
- 减少 DOM 操作（可使用 DocumentFragment）
- 避免不必要的重绘与重排（重排必定导致重绘）
- 优化 CSS 选择器（从右向左匹配）
- CSS/JS minify，减少文件体积
- 开启 Gzip 压缩
- 将 CSS 放到顶部，JavaScript 放到尾部（JavaScript 会阻塞页面）
- 压缩图片以及使用 CSS Sprite
- 使用 CDN 加速，适当进行文件缓存
- 合理控制 cookie 大小（每次请求都会包含 cookie）



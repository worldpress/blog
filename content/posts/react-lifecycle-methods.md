---
title: React 生命周期函数小结
date: 2016-10-02 01:10:17
tags:
  - JavaScript
  - 前端
  - React
categories:
  - 技术文章
---

生命周期函数是指，在组件生命周期上的特定点上执行的各个函数。
React 的组件声明周期函数分为三种：挂载，更新以及卸载。

## 挂载
组件挂载的生命周期函数都在初始化渲染前后被调用。

### componentWillMount
只调用一次，在客户端与服务端都执行。在初始化渲染之前被调用。

<!--more-->

### componentDidMount
只调用一次，在客户端执行，不在服务端执行。在初始化渲染之后被调用。
使用 `setTimeout` 或 `setInterval`, Ajax 请求等这些操作，均在这个方法内。

## 更新
所有组件更新的生命周期函数都不会在初始化渲染被调用。

### componentWillReceiveProps
当组件收到新的 `props` 时被调用。不会在初始化渲染被调用。
在这个函数里调用 `this.setState() `不会触发任何额外的渲染。（PS: 就是在这里被坑了 T-T）

>  如果需要实现一个对 state 变化相应的操作，使用 [componentWillUpdate](#componentWillUpdate)

### shouldComponentUpdate

当新的 `props` 或者 `state` 被收到，在渲染前被调用。不会在初始化渲染时被调用。
如果 `shouldComponentUpdate` 返回 `false`，`render()` 会在下次 `state` 变化前被完全跳过。[componentWillUpdate](#componentWillUpdate)  和 [componentDidUpdate](#componentDidUpdate)  将不会被调用。

### componentWillUpdate
当新的 `props` 或者 `state` 被收到，在渲染前被立即调用。不会在初始化渲染被调用。
**不能在这个方法里使用 `this.setState() `。**

### componentDidUpdate
在组件的更新被更新到 DOM 后立即被调用。不会在初始化渲染被调用。

## 卸载

### componentWillUnmount
在组件卸载前被调用，主要用来执行一些组件的清理工作。

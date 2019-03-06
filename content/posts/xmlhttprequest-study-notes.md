---
title: XMLHttpRequest 学习笔记
date: 2017-03-02 18:35:39
tags:
  - JavaScript
  - 前端
categories:
  - 技术文章
---

> AJAX即“Asynchronous JavaScript and XML”（异步的JavaScript与XML技术），指的是一套综合了多项技术的浏览器端网页开发技术。

Ajax 技术的核心是 `XMLHttpRequest` 对象，起初 IE 首先引入这个特性，后面其他浏览器供应商也提供了相同的实现。

## XMLHttpRequest 对象

XMLHttpRequest 是一个API, 它为客户端提供了在客户端和服务器之间传输数据的功能。它提供了一个通过 URL 来获取数据的简单方式，并且不会使整个页面刷新。

<!--more-->

### 主要方法

- open() 启动请求以备发送，参数包括请求方式，请求地址，是否异步

- send() 发送请求，必要参数可发送请求主体数据，无数据时传入 null

- abort() 发起异步请求时，终止请求

- setRequestHeader() 设置请求头部信息

- getRequestHeader() 获取请求头部信息

- getAllRequestHeader() 获取全部请求头部信息，以字符串的形式返回

### 主要属性

- status 响应的 HTTP 状态码

- statusText 响应的 HTTP 状态说明

- responseText 作为响应主体返回的文本

- responseXML 响应数据中的 XML DOM 文档

- readyState 请求/响应过程的当前活动阶段

 - 0 未初始化，没有使用 `open()`

 - 1 启动，调用 `open()` 但未调用 `send()`

 - 2 发送，已经调用 `send()`，但未接收到响应数据

 - 3 接收，接收到部分响应数据

 - 4 完成，接收到全部响应数据

### readystatechange 事件

当 readyState 属性值改变时触发 readystatechange 事件。通过判断 readystate 属性的值，在完成请求响应整个过程之后执行某些操作。

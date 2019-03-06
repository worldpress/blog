---
title: 如何减少浏览器回流
date: 2016-08-02 22:46:33
tags:
  - JavaScript
  - 前端
categories:
  - 技术文章
---

## 什么是浏览器回流
浏览器在显示网页时，需要计算每一个元素应该放置的位置，这个计算过程就称为浏览器回流（browser reflow）。回流会重新计算页面的布局，在回流中会重新计算元素的尺寸与位置，并且也会触发对子元素的回流。

触发浏览器回流的操作：
- 在 DOM 中插入，移除或者更新元素
- 修改页面上的内容
- 移动 DOM 元素
- 修改元素 CSS 样式
- 修改元素的类名
- 调整窗口的大小

<!--more-->

基本上跟元素相关的操作都会触发浏览器回流。浏览器的回流需要耗时，尽量减少浏览器的回流，那么就可以提高整个网页的效率。

## 创建单一元素
当我们需要创建一个新元素插入到页面中，并且设置元素的属性。我们会这样做：

``` js
function addElement(parent, elementText) {
  var element = document.createElement('a');
  parent.appendChild(element);
  element.innerHTML = anchorText;
}
```

这样写会产生2次浏览器回流，新创建的元素在插入页面中之后又进行了属性的修改。更好的写法是把插入到页面的操作放到最后，这样给元素设置属性的操作就是在内存中进行的。这样就只有元素插入到页面时产生的一次回流。

``` js
function addElement(parent, elementText) {
  var element = document.createElement('a');
  element.innerHTML = anchorText;
  parent.appendChild(element);
}
```

## 创建多个元素
在实际的使用中，更多的情况是创建多个元素，并插入到页面中。按照创建单一元素插入到页面时的写法，我们会这样写：

``` js
function addElements(parent, elementText) {
  var element;

  for (var i = 0; i < 10; i++) {
    element = document.createElement('a');
    element.innerHTML = anchorText;
    parent.appendChild(element);
  }
}
```

可以看出，这样写会产生10次回流，每一次插入元素都会产生一次。这时候我们需要用到 [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)，DocumentFragment 有占位符的作用，可以暂时存放那些插入文档元素。

当把一个 DocumentFragment 插入文档树时，插入的不是 DocumentFragment 自身，而是它的所有子孙节点。可以用 `Document.createDocumentFragment()` 方法创建新的空 DocumentFragment 节点。

通过 DocumentFragment 可以让上面的操作值产生一次浏览器回流：

``` js
function addElements(parent, elementText) {
  var element,
      fragment = document.createDocumentFragment();

  for (var i = 0; i < 10; i++) {
    element = document.createElement('a');
    element.innerHTML = anchorText;
    fragment.appendChild(element);
  }

  parent.appendChild(fragment);
}
```
## 修改元素样式

在 JavaScript 中修改元素的样式也是经常会做的操作。修改元素的多个样式时会这样：

``` js
function changeStyle(element) {
  element.style.fontSize   = "14px";
  element.style.fontWeight = "600";
  element.style.color      = "#fff";
}
```

实际上，每一次对元素的样式的变更都会产生一次回流。好的做法是创建一个 class 包含这些样式。

``` css
.changeStyle {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
```

``` js
function changeStyle(element) {
  element.className = 'changeStyle';
}
```

## 总结
减少浏览器回流的方式，就是将一切能够在内存完成的完成之后再应用到页面中，对元素样式的操作尽量通过添加修改 CSS 类来实现。

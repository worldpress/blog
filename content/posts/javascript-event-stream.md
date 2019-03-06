---
title: 事件流：冒泡与捕获
date: 2016-04-16 11:29:49
tags:
  - JavaScript
  - 前端
categories:
  - 技术文章
---

## 事件流
事件流描述的是从页面中接收事件的顺序。在 JavaScript 中事件流有两种，一种是由 IE 开发团队提出的事件冒泡流，而另一种是 Netscape 提出的事件捕获流。

### 事件冒泡
事件冒泡流，即事件开始时由具体的元素接收，然后逐级向上传播，直到 document 对象。

```html
<div>
  <p> Click </p>
</div>
```
<!--more-->

上面的例子中，点击 `p` 元素，事件冒泡的顺序是 p > div > body > html > document。

**所有的现代浏览器都支持事件冒泡，部分具体实现不同。**

### 事件捕获
事件捕获流，即与事件冒泡相反，先在上级元素接收，然后逐级向下传播，直到最具体的元素。（有点像是逐级定位，到最后的元素就是事件冒泡流的起点）

和上面同样的例子，点击 `p` 元素，事件捕获的顺序是 document > html > body > div > p。

**由于老版本不支持，因此很少使用事件捕获。尽量使用事件冒泡。**

### DOM 事件流
实际上每一次触发事件都会有一个事件流，事件流包括三个阶段，事件捕获阶段，处于目标阶段，事件冒泡阶段。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title> Event </title>
  </head>
  <body>
    <div> Cilck </div>
  </body>
</html>
```

即在上面的例子中，事件流包括
- 事件捕获阶段：document > html > body
- 处于目标阶段：div
- 事件冒泡阶段：body > html > document

## 事件处理程序
添加事件处理程序的方式有 3 种：使用 HTML 的特性，赋值给事件处理程序属性，使用 addEventListener 函数。

### 使用 HTML 的特性

```html
<input type="button" value="Click" onclick="alert('Clicked')">
```

这样就是在 HTML 中使用 HTML 中与事件处理程序同名的属性来指定。也可以将该属性的值指向页面中其他地方定义的方法。

通常不建议这样做，这样写的缺点是 HTML 与 JavaScript 紧密耦合，修改起来也麻烦。

### 赋值给事件处理程序属性

这是 JavaScript 中指定事件处理程序的传统方式，将一个函数赋值给事件处理程序属性。

```html
<input type="button" id="btn" value="Click">
```

```js
var btn = document.getElementById('btn');
btn.onclick = function () {
  alert("Clicked");
};
```

这样的效果其实与使用 HTML 特性的例子的作用是相同的，不同的是 JavaScript 指定事件在 js 文件中，这样就与 HTML 解耦了。要删除指定的事件处理程序可以将属性的值设置为 null。

赋值给事件处理程序属性的缺点在与对同一个元素的同一个事件只能添加一个事件处理程序。重复添加相同的事件会覆盖前面所添加的事件。

```js
btn.onclick = function () {
  alert("Clicked-01");
};

btn.onclick = function () {
  alert("Clicked-02");  // 覆盖了上面设置的 onclick 事件
};
```

### 使用 addEventListener 函数
使用 `addEventListener()` 的好处是可以添加多个同一事件的处理程序，不会像使用事件处理程序属性一样覆盖。

`addEventListener()` 有对应的删除事件的方法 `removeEventListener()`，两个方法都接受三个参数。要处理的事件类型（click, blur ...），作为事件处理程序的函数，以及表示是否在捕获阶段调用的布尔值。

#### 添加事件处理程序
给按钮的 click 事件添加事件处理程序：
```js
var btn = document.getElementById('btn');
btn.addEventListener('click', function() {
  alert("click");
}, false);
```

上面为按钮添加了一个 click 事件处理程序，并且该事件会在冒泡阶段被触发。（第三个参数默认为 false, 上面的例子中可忽略不写）

为同一个元素添加同一个事件的对个事件处理程序函数：
```js
btn.addEventListener('click', function() {
  alert("Clicked-01");
});

btn.addEventListener('click', function() {
  alert("Clicked-02");
});
```

这里给按钮的 click 事件添加了两个事件处理程序，这两个事件处理程序会按照添加的顺序触发。首先显示 "Clicked-01"，然后显示 "Clicked-02"。

#### 移除事件处理程序
使用 `addEventListener()` 添加的事件处理程序，可以通过 `removeEventListener()` 来移除，但是两个函数的参数必须相同。

```js
var btn = document.getElementById('btn');
function handler() {
  alert("Cilcked");
}

btn.addEventListener('click', handler, false);

btn.removeEventListener('click', handler, true);  // 无效

btn.removeEventListener('click', handler, false);  // 有效
```

大多数情况下，都是讲事件处理程序添加到事件流的冒泡阶段，这样可以最大限度地兼容各个浏览器。只在需要在事件到达目标之截获的时候将事件处理程序添加到捕获阶段

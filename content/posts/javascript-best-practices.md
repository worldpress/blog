---
title: JavaScript 最佳实践
date: 2016-08-31 22:57:34
tags:
  - JavaScript
  - 前端
categories:
  - 技术文章
---

> 翻译自：[JavaScript Best Practices: Tips & Tricks to Level Up Your Code](https://www.codementor.io/javascript/tutorial/javascript-best-practices)
> 没有严格的按照原文翻译，删减修改了部分内容。

在这个教程中，会列出一些重要的 JavaScript 的最佳实践，学习这些并不会很困难。

## 避免污染全局作用域
声明变量是很有趣的，有时候你会在你不知情的情况下声明了全局变量。在现在的浏览器中，全局变量将会存储在 `window` 变量中。在全局作用域中的变量可能在不经意间被覆盖。

<!--more-->

假设你现在有一个 HTML 文件，其中包括一个 `<script>` 标签，包含如下内容：

``` js
var foo = 42;
console.log(foo);
```

显然这会在控制台中输出 42。但是，由于这些代码不是在函数中执行的，而是处于全局作用域中，因此 foo 将会被附加到 `window` 上。也就是说 `window.foo` 的值同样也是 42。

这样做是危险的，因为这样会覆盖现有的全局变量。

``` js
function print () {
  // do something
}
print();
```

当执行 `window.print` 或者 `print` 时，因为我们重写了 `print` 函数，所以原来的打印函数不起作用了，也就不会弹出打印框了。

解决办法很简单：使用立即执行函数（IIFE）。

``` js
// Declare an anonymous function
(function () {
   var foo = 42;
   console.log(window.foo);
   // → undefined
   console.log(foo);
   // → 42
})();
//^ and call it immediately
```

或者，可以将 `window` 等全局变量作为参数传递给函数（这可能提高性能）：

``` js
(function (global, doc) {
  global.setTimeout(function () {
     doc.body.innerHTML = "Hello!";
  }, 1000);
})(window, document);
```

所以，我们可以使用上述的两种方式，避免不知情的情况下创建全局变量。

## 使用 "use strict"
严格使用 `"use strict"`，这只不过是在你的代码中添加字符串，但它的作用非常大。

比如：

``` js
// This is bad, since you do create a global without having anyone to tell you
(function () {
   a = 42;
   console.log(a);
   // → 42
})();
console.log(a);
// → 42
```

上述代码，如果使用 `"use strict"`，你将会得到一些错误信息：

``` js
(function () {
   "use strict";
   a = 42;
   // Error: Uncaught ReferenceError: a is not defined
})();
```

你可能会很奇怪，为什么不把 `"use strict"` 放到函数之外？实际上你可以将它放到函数外，但是这样的话他就在全局环境中应用了。这有可能影响来自其他库的代码。

## 使用 ===
如果你比较 a 和 b 时使用 `==`，在 JavaScript 中你会发现这是一种奇怪的方式。如果你有一个字符串和一个数字，像是下面这样。他们将是相等的，即返回 true：

``` js
"42" == 42
// → true
```

这是一种不严格的比较，在进行数据验证时，最好使用 `===`。这将会严格的比较 a 与 b 是否相等：

``` js
"42" === 42
// → false
```

## 使用神奇的 && 和 ||
根据的你的需要，可以使用逻辑运算符使得代码更加简短。例如：

``` js
"" || "foo"
// → "foo"

undefined || 42
// → 42

// Note that if you want to handle 0 there, you need
// to check if a number was provided:
var a = 0;
a || 42
// → 42

// This is a ternary operator—works like an inline if-else statement
var b = typeof a === "number" ? a : 42;
// → 0
```

可以这样简单的实现 if 的检查：

``` js
expr && doSomething();

// Instead of:
if (expr) {
   doSomething();
}
```

如果你需要返回结果，你还可以这样做：

``` js
function doSomething () {
   return { foo: "bar" };
}
var expr = true;
var res = expr && doSomething();
res && console.log(res);
// → { foo: "bar" }
```

这里你可以不同意我的观点，但这是比较理想的情况。如果你不想要这样丑化你的代码，使得代码隐晦。这是那些 JavaScript 压缩工具会做的事情，你可以使用它们。

虽然代码比较短，但是这依然是具有可读性的。

## 转换类型
有很多种方式去进行类型转换，要怎么转换取决于你。这里有一些常用的方法：

``` js
// From anything to a number

var foo = "42";
var myNumber = +foo; // shortcut for Number(foo)
// → 42

// Tip: you can convert it directly into a negative number
var negativeFoo = -foo; // or -Number(foo)
// → -42

// From object to array
// Tip: `arguments` is an object and in general you want to use it as array
var args = { 0: "foo", 1: "bar", length: 2 };
Array.prototype.slice.call(args)
// → [ 'foo', 'bar' ]

// Anything to boolean
/// Non non p is a boolean p
var t = 1;
var f = 0;
!!t
// → true
!!f
// → false

/// And non-p is a boolean non-p
!t
// → false
!f
// → true

// Anything to string
var foo = 42;
"" + foo // shortcut for String(foo)
// → "42"

foo = { hello: "world" };
JSON.stringify(foo);
// → '{ "hello":"world" }'

JSON.stringify(foo, null, 4); // beautify the things
// →
// '{
//    "hello": "world"
// }'

// Note you cannot JSON.stringify circular structures
JSON.stringify(window);
// ⚠ TypeError: JSON.stringify cannot serialize cyclic structures.
```

## 代码风格
对新项目，保持项目中的所有代码的风格相同。对于现有项目，使用现有项目的代码风格，除非你真的想去改变它。

**制定你的代码风格，并始终遵循它**

这里还有一些推荐的现有代码风格：

- [Google JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.xml)
- [airbnb/javascript](https://github.com/airbnb/javascript)



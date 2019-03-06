---
title: JavaScript 数据类型判断
date: 2016-11-21 15:07:49
tags:
  - JavaScript
  - 前端
categories:
  - 技术文章
---
最近开始读之前没有读完的 underscore 的源码，刚把 Object 部分读完。对 JavaScript 中类型判断部分的总结。

## Object.prototype.toString()
在进行类型判断时，使用到最多的当属 `Object.prototype.toString()`。

`toString()` 方法返回一个代表该对象的字符串。每个对象都会继承 Object 上的 `toString` 方法，如果该方法没有被同名方法覆盖的话。使用 `toString()` 方法将会返回字符串 `"[object type]"`。其中 type 根据对象的类型的不同而不同。

关于 `Object.prototype.toString()` 的详细描述可以查看：[Object.prototype.toString() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

<!--more-->

## 使用 toString() 判断类型
由于 `toString()` 会返回带有类型信息的字符串，所以通常可以使用它来进行数据类型的判断。

underscore 中对一些数据类型的判断实现：

```js
_.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
  _['is' + name] = function(obj) {
    return toString.call(obj) === '[object ' + name + ']';
  };
});
```

通过 `toString()` 函数的返回值判断类型，这里不使用 `typeof` 判断的原因是字面量与对象的返回值不同。

例如字符串字面量 `"1"` 通过 `typeof` 操作符返回的是 `"string"`，而字符串对象 `new String('1')` 通过 `typeof` 操作符返回的却是 `"object"`。所以通过 `Object.prototype.toString()` 来进行判断最为妥当。

## 判断 NaN，null，undefined

### NaN
在 JavaScript 的 Number 类型中有这样一个特殊的存在，那就是 `NaN`。`NaN` 的意思是 Not-A-Number，即不是一个数字。当对无法转换为数字的变量进行数字转换时就会得到 `NaN`。`Nan` 还有一个特殊的性质，就是 `NaN === NaN` 返回的是 false。

所以对 NaN 的判断的实现如下：

``` js
_.isNaN = function(obj) {
  return _.isNumber(obj) && isNaN(obj);
};
```

先判断是否为 Number 类型，排除隐式类型转换造成的误判。再使用 isNaN 函数判断是否为 NaN。

### null
在 JavaScript 中有 `==` 与 `===` 两个相等操作符，后者为严格比较。`null == undefined` 的返回值是 true，所以不能使用这个来判断是否为 null。而 `null === undefined` 返回的是 false，因此使用严格相等哎判断是否为 null。而

``` js
_.isNull = function(obj) {
  return obj === null;
};
```

### undefined
判断变量是否为 `undefined`，很自然会想到使用 `foo === undefined` 的方式来判断。但是这样做是不安全的，在旧的浏览器版本上 `undefined` 是可以被重写的。这时使用上面那样判断会出现这种状况：

``` js
undefined = 'foo';
var foo = 'foo';

console.log(foo === undefined); // true
```

所以这种判断方式不被推荐，即使新版本的浏览器上无法重写 undefined。更推荐的方式是使用 `void 0` 来判断。
关于 `void 0` 与 `undefined` 可以参考我在知乎上的回答：[（void 0）在javascript中表示什么，和undefined有什么区别？](https://www.zhihu.com/question/52645620/answer/131470539)

推荐的 undefined 判断实现：

``` js
_.isUndefined = function(obj) {
  return obj === void 0;
};
```

## 判断 Object
在 underscore 中对对象类型的判断是通过 `typeof` 来实现的：

``` js
_.isObject = function(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};
```

`typeof` 操作符在变量为 `null` 或者是对象时返回 `"object"`，在变量为函数对象时返回 `function`。

我们需要的是判断变量是否为对象，那么就需要排除 `null` 的情况，即将变量进行两次取反操作，将变量转换为 `Boolean` 类型。由于 `null` 会转换为 `false`，那么这样就可以排除 `null` 的干扰。

---
title: apply, call 与 bind 的区别
date: 2016-03-20 23:02:08
tags:
  - JavaScript
  - 前端
categories:
  - 技术文章
---
最近在看 《JavaScript 高级程序设计》，也就是所谓的高程3。正好看到 `Function` 部分，看到了几个熟悉的字眼，`apply()`，`call()` 和 `bind()`。好像是有些面试题里面有，遂搞清楚了记录下。

## apply() 与 call()

每个函数都包含两个非继承的方法：`apply()` 和 `call()`。两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内 `this` 对象的值。这是书中的说法，大概意思就是 `apply()` 和 `call()` 这两个方法是用来改变函数中 `this` 的指向的。而 `apply()` 与 `call()` 的区别就在与接收参数的方式。

`apply()` 方法接收两个参数，一个是在其中运行函数的作用域，函数中的 `this` 的值，另一个是参数数组。
而 `call()` 方法的第一个参数跟 `apply()` 相同，不同的是除了第一个参数，后面的其他参数将会直接传递给函数。

<!--more-->
```
function sum(num1, num2) {
  return num1 + num2;
}

// 使用 apply()
function applySum(num1, num2) {
  return sum.apply(this, arguments);
}

// 使用 call()
function callSum(num1, num2) {
  return sum.call(this, num1, num2);
}

alert(applySum(1, 2)); // 3
alert(callSum(1, 2)); // 3
```

这里使用 `apply()` 与 `call()` 的效果都是一样的，不同的只是除了 `this` 的指向之外的参数的传递形式不同。在不给函数传递参数的时候则完全一样，当不知道需要传递的函数参数的个数时，使用 `apply()` 更好。

实际上 `apply()` 与 `call()` 的用法并不只是这些。他们可以扩充函数赖以运行的作用域，即可以改变函数运行时的上下文。

```
name = "unknown";
var person = {
  name = "ahonn";
}

function sayName() {
  console.log(this.name);
}

sayName() // unknown
// 函数中的 this 为全局环境
sayName.apply(this); // unknown
// 函数中的 this 指向了 person
sayName.apply(person) // ahonn
```

上面的例子中的 `apply()` 换成 `call()` 的话效果相同，因为我这样只给 `apply()` 传了第一个参数。

## bind()
`bind()` 方法与 `apply()` 和 `call()` 相似，同样是可以改变函数内 this 的指向。但与 `apply()`, `call()` 不同的是，`bind()` 方法会创建一个新函数，称为绑定函数，当调用绑定函数时，函数会以创建时的第一个参数 this 作为函数运行的作用域。

```
name = "unknown";
var person = {
  name = "ahonn";
}

function sayName() {
  console.log(this.name);
}

var sayAhonnName = sayName.bind(person);

// 函数中的 this 指向 person
sayAhonnName() // ahonn
```

也就是说，`bind()` 方法可以绑定一个上下文到函数中，产生一个新的绑定函数。这样就可以在需要的时候去运行有指定 this 对象的函数。

使用变量保存 this 的做法：
```
var foo = {
  bar: 1,
  eventBind: function() {
    var _this = this;
    $('.someClass').on('click', function(event) {
      console.log(_this.bar);
    });
  }
}
```

因为在 JavaScript 中函数也是对象，使用如果不使用 `_this` 来保存上下文环境的话，在绑定的事件函数中将找不到 `bar` 这个值，因为上下文环境发生了改变。更优雅的做法就是使用 `bind()` 来完成。

```
var foo = {
    bar : 1,
    eventBind: function(){
        $('.someClass').on('click',function(event) {
            console.log(this.bar);
        }.bind(this));
    }
}
```

这样就把 `$('.someClass').on('click',function(event) {}` 外的上下文环境给绑定到了函数内了。

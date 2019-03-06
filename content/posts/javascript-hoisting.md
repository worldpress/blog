---
title: 不合常理的变量提升
date: 2016-04-28 21:56:42
tags:
  - JavaScript
  - 前端
categories:
  - 技术文章
---

## 变量提升

### 合乎常理的预期
按照合乎常理的预期，程序应该是由上至下一行一行执行的，如果使用了之前没有定义的变量的话，正确的反应应该是会报错，就象下面这段 C++ 代码：
```cpp
#include <cstdio>
using namespace std;

int main() {
  printf("%d\n", &n);  // Error

  int n = 2;
}
```
<!--more-->

### 并不完全正确
实际上合乎常理的预期并不是“完全正确”的，在 JavaScript 中并不符合直觉。

例如这段 JavaScript 代码：

```js
console.log(n);

var n = 2；
```

讲道理，就直觉来说这段代码应该是会报错的。但是 JavaScript 却不是像往常的其他编程语言一样报错，而是输出 undefined。

先把问题留着，再看看另一段代码。

```js
var n;

console.log(n);

n = 2;
```

这段代码的输出同样也是 undefined，实际上这两段代码在编译器上是没有差别的，第一段代码实际上是按照第二段代码那样执行的。就像是变量的声明部分从原来的位置移动到了当前作用域最顶部，这个过程就叫作 **提升**。只有声明本身会被提升，而赋值操作依旧会留着原地。

## 函数提升

函数在声明时也会像变量一样被提升。但是不同的是，函数表达式不会被提升。

### 函数声明

函数声明提升：
```js
foo();

function foo() {
  console.log(n);
  var n = 2;
}
```

实际上代码将会按照下面的形式执行：
```js
function foo() {
  var n;
  console.log(n);
  n = 2;
}

foo(); // undefined
```

函数 `foo` 的作用域内的变量 `n` 提升到了作用域的顶部，全局作用域里的 `foo` 函数声明也会被提前到所处的作用域顶部，即全局作用域的顶部。但是函数表达式的话只有变量被声明，但是赋值给变量的函数不会被提升。

### 函数表达式

函数表达式不会被提升：
```js
foo();

var foo = function bar() {
  // do something
}
```

函数表达式的提升类似与变量的提升：
```js
var foo;

foo(); // TypeError

foo = function bar() {
  // do something
}
```

这样会引发 `TypeError` 异常，因为当时的 `foo` 并没有赋值，对 `undefined` 进行函数调用会导致非法操作抛出异常。

### 函数优先
函数会首先被提升，然后跟着才是变量。也就是说同时存在函数声明与函数表达式时，函数声明会优先于函数表达式提升。

```js
foo();

function foo() {
  console.log('1');
}

var foo = function () {
  console.log('2');
}
```

上面的代码将会被理解成下面的形式：
```js
function foo() {
  console.log('1');
}

var foo;

foo(); // 1

foo = function () {
  console.log('2');
}
```

所以实际上的输出是 1，因为函数表达式的赋值操作会在原来的位置，而声明操作则是提升到作用域顶部，但是优先级低于函数声明。

重复声明同名变量在 JavaScript 非严格模式中将会被忽略，所以实际上函数表达式的位置并没有改变。

---
title: JavaScript 函数式编程笔记
date: 2018-09-15 00:01:27
tags:
  - JavaScript
  - 函数式编程
categories:
  - 技术文章
---

> 本文为 [JS 函数式编程指南](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/cotent/)  笔记

## 函数是一等公民
当我们说函数是“一等公民”的时候，我们实际上说的是它们跟其他对象都一样，你可以像对待其他数据结构一样对待它们。

## 纯函数
相同的输入产生相同的输出，并且没有副作用，即为纯函数。例如 `Array.prototype.slice` 是纯函数，而 `Array.prototype.splice` 不是纯函数。

只要函数跟外界环境发生交互，就是有副作用。但并不是说要禁止副作用，函数式的编程哲学是假定副作用是造成不正当行为的主要原因。

<!--more-->

纯函数的好处：
- 可缓存性 Cacheable
- 可移植性 Portable
- 可测试性 Testable
- 合理性 Reasonable (引用透明)

## 柯里化
只传递一个参数来调用它，然后返回另一个函数处理剩下的参数，称为柯离化，也叫做局部调用。

```js
const _ = require('lodash/fp')

const add = _.curry((a, b) => a + b)

const add2 = add(2)

add2(3) // 5
```

## 组合
通过组合两个或多个函数返回一个新的函数，例如:

```js
const g = n => n + 1;
const f = n => n * 2;

const fn = compomse(f, g);

fn(1); // => f(g(1)) => 4
```

在 compomse 中，g 将先于 f 执行，因此创建了一个从右到左的数据流。

*结合律：compomse(f, compomse(g, h)) 等同于 compomse(compomse(f, g), h)*

## pointfree
    “Love means never having to say you're sorry”

pointfree 模式是指永远不需要声明数据。

以一个不恰当的代码比喻：
```js
const hello = name => console.log(`hello ${name}`);

// not pointfree
const sayHello = (name) => {
  return hello(name);
}

// pointfree
const sayHello = hello
```

PS: 个人理解，pointfree 即是指函数仅只是其他函数的组合，并不需要指定外部的数据，函数中也不需要传入外部变量。
但这无法绝对避免，例如获取某个时间字符串的时间戳：`const timestamp = (date) => (new Date(date)).getTime()`。

## debug
在函数的组合中需要进行 debug 的话，可以使用 `trace` 函数。

```js
  const trace = curry((tag, value) => {
    console.log(tag, value);
    return value;
  });
```

将 `trace` 函数插入到 `compomse` 中即可检查上一个函数返回值是否正确。

## identity
范畴学中独特的态射，这个函数接受随便什么东西，然后原封不动的吐出来。一个假装自己是普通数据的函数。

```js
const identity = x => x;
```

identity 函数可以一起使用，但是看起来好像是没有卵用：
```js
compomse(identity, f) == compomse(f, identity) == f
```

## 类型签名

接受具体类型，返回具体类型：
```js
// hello::String -> String
const hello = name => `hello ${name}`;
```

接受任意类型，并返回相同类型：
```js
// identity::a -> a
const identity = n => n
```

接受函数参数：
```js
// map::(a -> b) -> ![pic](a) -> ![pic](b)
const map = curry((f, xs) => xs.map(f));
```

### 类型约束
```js
// sort::Ord a => ![pic](a) => ![pic](a)
const sort = balabala
```

胖箭头的左边表明 a 一定是一个 Ord 对象，也就是说 a 必须要实现 Ord 接口（可排序）。

通过这种方式能够限制函数的作用范围，这种接口声明叫做类型约束。

## functor

```js
const Functor = (x) => {
  this.__value = x;
};

Functor.of = x => new Functor(x);

Functor.prototype.map = f => Functor.of(f(this.__value));
```

functor 是实现了 `map` 函数，并遵守某些特点规则的容器类型，具有 `mappable` 的特点（类似于 Promise 的 thenable）。

### Maybe
Maybe 是另一种 functor，实际上只是多了空值检查。

```js
const Maybe = (x) => {
  this.__value = x;
};

Maybe.of = x => new Maybe(x);

Maybe.prototype.isNothing = () => this.__value === null || this.__value === undefined;

Maybe.prototype.map = f => this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
```

Maybe 使得在 `map` 调用中产生 null 或者 undefined 时不会爆出错误，而是最后返回 `Maybe.of(null)`。

### Either
Either 又是另外一种 functor, 不同于正常的 functor, Either 不管怎么 map 都不会改变自己的值。

```js
const Either = (x) => {
  this.__value = x;
};

Either.of = x => new Either(x);

Either.prototype.map = () => this;
```

Either 用于错误处理，当出现错误时我们返回一个 `Either.of(error)`, 它将把错误带到最后，并显示出来。
实际上它就是一个错误消息的 functor, 只是指不会被改变。

### IO
IO 又又是另外一种 functor, 与最普通的 functor 的差别是，IO 的 `__value` 是一个函数（不过，我们把它当成是数据）。

```js
const IO = (f) => {
  this.unsafaPerfromIO = f;
};

IO.of = x => new IO(() => x);

IO.prototype.map = f => IO.of(compomse(f, this.unsafaPerfromIO));
```

IO 把非纯的动作捕获到包裹函数中，延迟执行非纯的动作。并且，假装 IO 的返回指不是包裹函数本身，而是包裹函数执行后的返回值。

当需要获取 IO 的值的时候，就执行 `IO.unsafaPerfromIO()`（此时才会执行整个过程 map by map）。

## Monad
  pointed functor 是指实现了 `of` 方法的 functor

  monad 是可以变扁的 pointed functor

monad 主要的使用场景是用来解决嵌套的 functor。

一个 functor，只要它定义了一个 `join` 方法和 `of` 方法，并遵守一些定律，那么它就是一个 monad。

```js
const getItem = key => IO.of(() => localStorage.getItem(key));

const log = x = IO.of(() => {
  console.log(x);
  return x;
});

const printItem = compomse(join, map(log), getItem);

printItem('xxx').unsafaPerfromIO();
```

### chain 函数

chain 函数是 functor map 之后 join 的抽象行为
```js
const chain = curry((f, m) => m.map(f).join());
```

PS: 其实没有啥用，只是把 `compomse(join, map(log), ...)` 变成了 `compomse(chain(log), ...)`

## Applicative Functor

applicative functor 能够以一种简明扼要的方式把一个 functor 的值应用到另外一个 functor 上。

  applicative functor 是实现了 `ap` 方法的 pointed functor

```js
// applicative
Functor.prototype.ap = other => other.map(this.__value);

// Functor.of(add(2)).ap(Functor.of(3));
```

`Functor.of(x).map(f)` 等价于 `Functor.of(f).ap(Functor.of(x))`。

### lift

以 pointfree 的方式调用 applicative functor。

```js
const liftA2 = curry((f, functor1, functor2) => functor1.map(f).ap(functor2));
```

### 操作符

  haskell 中可以使用 `<$>` 表示 `map`, `<*>` 表示 `ap`。

```js
Functor.of(2).map(add).ap(Functor.of(3));
// map(add, Functor.of(2)).ap(Functor.of(3));
```

等同于：

```haskell
add <$> Functor 2 <*> Functor 3
```

## 定律
- 同一：`A.of(id).ap(v) == v`
- 同态：`A.of(f).ap(A.of(x)) == A.of(f(x))`
- 互换：`v.ap(A.of(x)) == A.of(f => f(x)).ap(x)`
- 组合：`A.of(compomse).ap(u).ap(v).ap(w) == u.ap(v.ap(w))`


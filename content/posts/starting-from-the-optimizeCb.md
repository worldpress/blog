---
title: 从 optimizeCb 说起
date: 2016-05-03 10:24:20
tags:
  - JavaScript
  - 前端
  - Underscore
categories:
  - 思考总结
---

## optimizeCb
在 `underscore` 中的内部函数 `optimizeCb`，顾名思义就是 optimize callback，即优化回调函数。

optimizeCb:

```js
// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
var optimizeCb = function(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1: return function(value) {
      return func.call(context, value);
    };
    // The 2-parameter case has been omitted only because no current consumers
    // made use of it.
    case 3: return function(value, index, collection) {
      return func.call(context, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(context, accumulator, value, index, collection);
    };
  }
  return function() {
    return func.apply(context, arguments);
  };
};
```

<!--more-->
它是这样处理回调的，当回调函数指定上下文环境时，根据 `argCount` 来分情况使用 `call`，不同情况的
区别只是 `call` 除了上下文环境之外的函数参数的个数不同。

除了参数个数为 1，3，4 使用 `call` 之外，其他情况使用 `apply`。这里原本存在的参数个数为 2 的
情况被删除了，原因是因为参数为 2 个的情况在 `underscore` 中基本没有。就是说，对于常用的情况
使用 `call`，而不常用的使用 `apply`。

那么是不是 `call` 的性能相较于 `apply` 更好呢？

## call 与 apply 的性能
使用 `optimizeCb` 与只使用 `apply` 的 `Cb` 进行比较

```js
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

var optimizeCb = function(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1: return function(value) {
      return func.call(context, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(context, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(context, accumulator, value, index, collection);
    };
  }
  return function() {
    return func.apply(context, arguments);
  };
};

var Cb = function(func, context) {
  return function() {
    return func.apply(context, arguments);
  }
};

function sum(a, b, c) {
  return a + b + c;
}

suite
  .add('optimizeCb', function() {
    optimizeCb(sum, this, 3)(24, 24, 24);
  })
  .add('Cb', function() {
    cb(sum, this)(24, 24, 24);
  })
  .on('cycle', function(event) {
  console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ 'async': true });
```

测试结果：
```
optimizeCb x 16,373,430 ops/sec ±0.93% (80 runs sampled)
cb x 8,729,305 ops/sec ±1.12% (90 runs sampled)
Fastest is optimizeCb
```

得出 `call` 在知道参数个数的时候比使用 `apply` 效率更高的结论。
通过搜索，找到了一篇 [call和apply性能对比](http://blog.csdn.net/zhengyinhui100/article/details/7837127)。

更严谨的说法是，当有this指向或者执行参数时，call的性能要明显优于apply。

## 结论
所以在编程过程中，如果要使用到 `call` 或者 `apply`，在知道参数个数的情况下，使用 `call` 是
一个好选择，使得编译器能够去优化。

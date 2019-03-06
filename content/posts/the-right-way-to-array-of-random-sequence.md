---
title: 数组乱序的正确姿势
date: 2016-07-25 10:53:19
tags:
  - JavaScript
  - 前端
  - Underscore
categories:
  - 思考总结
---

在 `underscore` 中有一个函数，其作用是将数组乱序排序，实现如下：

``` js
// Shuffle a collection, using the modern version of the
// [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// `shuffle` 函数。
_.shuffle = function(obj) {
  var set = isArrayLike(obj) ? obj : _.values(obj);
  var length = set.length;
  var shuffled = Array(length);
  for (var index = 0, rand; index < length; index++) {
    rand = _.random(0, index);
    if (rand !== index) shuffled[index] = shuffled[rand];
    shuffled[rand] = set[index];
  }
  return shuffled;
};
```
<!--more-->

其中使用的数组乱序的算法是 [Fisher–Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)。这是一个 O(n) 复杂度的随机排列数组元素的经典算法。

每次循环从前面的 `index` 个元素中随机选择一个元素 `shuffle[rand]`。将这个元素与第 `index` 个元素进行交换，直到 `index == length` 为止。这样对元素进行随机交换，对于每个结果所获得概率是均匀的。`_.shuffle` 方法是返回一个新的乱序数组，所以需要一个新的数组来存储。

对原有数组进行乱序：

``` js
function shuffle(arr) {
  var length = arr.length;
  for (var index = 0, rand; index < length; index ++) {
    rand = Math.floor(Math.random() * (length - 1));

    var temp = arr[rand];
    arr[rand] = arr[index];
    arr[index] = temp;
  }
  return arr;
}
```

**More**
- [JavaScript 数组乱序](https://github.com/hanzichi/underscore-analysis/issues/15)
- [数组的完全随机排列](https://www.h5jun.com/post/array-shuffle.html)

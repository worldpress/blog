---
title: "new Date(string) 在不同浏览器中的不同表现"
date: 2018-11-17 20:33:12
tags:
  - JavaScript
  - 前端
  - Date
categories:
  - 技术文章
---

最近在开发中使用了 `moment(string).isValid()` 去判断字符串是否为日期格式字符串。发现当字符串为 `xxxx-1` 时，在 Chrome 中 `moment('test-1').isValid()` 返回值为 true, 而当字符串为 `test1` 时则正确返回 false。而 Safari 则没有该问题，全部返回 false。

<!--more-->

moment 解析字符串构造 Date 对象的过程中会经过内置的解析函数解析字符串，再通过 `new Date (year, month[, date[ ,hours[ ,minutes [, seconds[ ,ms ]]]]])` 来构造 Date 对象。把 `test-1` 传入 moment 时，默认的解析函数没有解析出结果，则将 `test-1` 直接丢给 `new Date(string)` 处理。

通过 [ECMAScript® 2015 Language Specification](https://www.ecma-international.org/ecma-262/6.0/#sec-date-value) :
![ECMAScript](https://cdn.nlark.com/lark/0/2018/png/50606/1542262842829-ec1d3d9e-6b5f-4113-bd02-2640fcb7d6fd.png)

可知当调用 `new Date(string)` 时实际上约等于 `Date.parse(string)` 来处理传入的字符串。由 Date.parse(string) 的实现上实际看不出什么来。但 [Date.parse() - JavaScript | MDN - Mozilla](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) 上写了这么一句：“不推荐在ES5之前使用Date.parse方法，因为字符串的解析完全取决于实现。直到至今，不同宿主在如何解析日期字符串上仍存在许多差异，因此最好还是手动解析日期字符串”

实际实验 Safari 的输出:

![Safari Date.parse](https://cdn.nlark.com/lark/0/2018/png/50606/1542263179353-6b393f5e-242e-4c20-8e52-050d1a93b878.png)

以及 chrome 的输出：

![Chrome Date.parse](https://cdn.nlark.com/lark/0/2018/png/50606/1542263243746-88db04f3-aa20-4d87-8f5f-8f6a2de5a241.png)

验证了 MDN 上的说法，所以通过 `new Date(string)` 返回值是否为 `Invalid Date` 判断或者通过 `moment(string).isValid()`
返回值判断对应的字符串是否为日期时间格式字符串是不靠谱的。

正确的做法应该是通过传入解析格式来使用 `moment(string, format).isValid()` 来进行判断。


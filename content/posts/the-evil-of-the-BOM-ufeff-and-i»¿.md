---
title: "万恶的BOM：ï»¿ 与 \\ufeff"
date: 2017-07-24 22:14:22
tags:
  - CSS
  - 前端
categories:
  - 思考总结
---

最近在搞一个 Sass 文件的编译插件，主要使用 node-sass 来进行编译，在这过程中遇到一个蛮坑的小问题。

在不压缩的情况下使用 node-sass 进行编译的样式文件没有什么问题，可以正确的编译出该有的样式。可是当进行压缩时，就出了问题了。压缩后的文件莫名奇妙的在文件最开头多了几个奇怪的字符：`ï»¿`。

<!--more-->

本着有什么不懂先 Google 的原则，搜索 `"ï»¿"`。发现 stack overflow 上有个相关的问题：[How do I remove ï»¿ from the beginning of a file?](https://stackoverflow.com/questions/3255993/how-do-i-remove-%C3%AF-from-the-beginning-of-a-file)。原来这是一个叫 BOM（Byte Order Mark）的东西，字节顺序标记，出现在文本文件头部，Unicode编码标准中用于标识文件是采用哪种格式的编码。

> 在网页上使用BOM是个错误。BOM设计出来不是用来支持HTML和XML的。

上面这句来自 [「带 BOM 的 UTF-8」和「无 BOM 的 UTF-8」有什么区别？网页代码一般使用哪个？](https://www.zhihu.com/question/20167122/answer/14199022) 的回答。我想补充一下，更可恶的事情是 BOM 在 CSS 中。

由于在文件开头多出了一个 BOM，使得压缩后的所有样式都失效了。一开始我尝试在文件最开头加上 `@charset "utf-8"`，但是并没有什么用。不过发现了在加上 `@charset "utf-8"` 后，变成了这样：

![BOM](https://ahonn-me.oss-cn-beijing.aliyuncs.com/images/tnh93.jpg)

多出来的一个小红点，鼠标移上去显示 `"\ufeff"`。找到罪魁祸首了，搜索 `"\ufeff"` 发现有篇关于 JavaScript 中处理 BOM 的文章：[BOM 和 JavaScript 中的 trim](https://imququ.com/post/bom-and-javascript-trim.html)。

最后得到解决方案，在编译后的样式中进行替换，移除 `\ufeff`:

```js
css = css.replace("\ufeff", "");
```

虽然解决方案蛮简单的，但是在搜索答案与编码测试的过程中学到了蛮多。编码问题还是要注意的，虽然无法避免遇到 utf-8 with BOM，但是也应该尽量只保存为 utf-8 without BOM 编码格式。如果遇到奇怪的字符，那八成就是编码问题了。




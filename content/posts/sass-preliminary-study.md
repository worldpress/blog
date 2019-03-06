---
title: Sass 初探
date: 2016-06-07 21:57:57
tags:
  - CSS
  - Sass
categories:
  - 技术文章
---
## 为什么学 Sass

说起来其实很早就知道 `Sass` 这东西。刚开始写 Even 这个博客主题的时候就有在考虑是要用 `Less` 还是`Sass`，最后用了变量名用 `@` 开头的 Less（可能是 PHP 的原因，对 `$` 开头的变量名没什么好感）。

最近正在看 `Foundation`，源码是用 Sass 写的。`Bootstrap` 之前也是用 Less 的，不过后来也转向了 Sass。然后发现 `Foundation` 写得挺不错的，看看博客主题写的代码，简直不能看。正好打算把主题给重构重构，就顺手学学 Sass，用 Sass 写。
<!--more-->

## Sass 是什么

Sass 是CSS的扩展，增加了规则嵌套、变量、混合、选择器继承等等，通过使用命令行的工具把它转换成CSS代码，能够更编程语言化的写 CSS。

Sass 有两种语法，`Sass` 与 `SCSS`。`Sass` 使用的是类似于 Python 的缩进语法，而 `SCSS` 使用的语法与 CSS 相近，只是添加了一些其他的东西，可以看做是 CSS 超集。

PS: 使用 `SCSS` 语法的文件后缀是 `SCSS` （一定是大写）。

## SCSS 语法

### 变量
上面说了，刚开始我不用 Sass 的原因就是变量名是以 `$` 开头的。与 Less 不同的是，Sass 的变量赋值使用的是 `:`，跟 CSS 的属性赋值相同。

```scss
// sass style
$fontSize: 14px;
span {
  font-size: $fontSize;
}

// css style
span {
  font-size: 14px;
}
```

Sass 还支持多值变量，list 类型与 map 类型，与 JavaScript 中的 list, map 相似。

list 类型可以使用 `nth($list, $index)` 来取得 list 中的某个值，相同的 map 也有对应的取值的函数：`map-get($map, $key)`。

list 类型：
```scss
// sass style
$color-list: #fff, #000;
a {
  color: nth($color-list, 1);

  &:hover {
    color: nth($color-list, 2);
  }
}
```

map 类型：
```scss
// sass style
$color-map: (
  white: #fff,
  black: #000
);
a {
  color: map-get($color-map, white);

  &:hover {
    color: map-get($color-map, black);
  }
}
```

### 嵌套
与大部分 CSS 预处理器相同，Sass 也支持层级嵌套。这样可以更好的表示 CSS 的层级关系。

```scss
// sass style
ul {
  margin: 5px;

  li {
    list-style: none;
  }
}

// css style
ul {
  margin: 5px;
}

ul li {
  list-style: none;
}
```

### 混合
Sass 中使用 `@mixin` 声明混合，可以传递参数，多个参数以逗号分开，也可以给参数设置默认值。声明的@mixin通过@include来调用。

```scss
//sass style
@mixin center-block {
    margin-left:auto;
    margin-right:auto;
}
.demo{
    @include center-block;
}

//css style
.demo{
    margin-left:auto;
    margin-right:auto;
}
```

### 条件与循环
一般的 CSS 是没有条件与循环的，拥有了条件与循环语句的 Sass 更加的灵活，可以使得 CSS 样式根据变量而改变。

#### 条件
Sass 中的条件语句为 `@if` 与 `@else`, 可以组合成为 `@else if`。
```scss
// sass style
$color: white;
p {
  @if $color == white {
    color: #fff;
  }
  @else {
    color: #000;
  }
}

// css style
p {
  color: #fff;
}
```

#### 循环
for循环有两种形式，分别为：`@for $var from <start> through <end>` 和 `@for $var from <start> to <end>`。`through` 与 `to` 的区别是循环包不包括 `<end>`。

```scss
// sass style
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}

// css style
.item-1 {
  width: 2em;
}
.item-2 {
  width: 4em;
}
.item-3 {
  width: 6em;
}
```

each循环语法为：`@each $var in <list or map>`，与 JavaScript 中的 `each` 类似，即是遍历 list 或者 map。

```scss
// sass style
$color-list: red green yellow;
@each $color in $color-list {
  .#{$color} {
    color: $color;
  }
}

// css style
.red {
  color: red;
}
.green {
  color: green;
}
.yellow {
  color: yellow;
}
```

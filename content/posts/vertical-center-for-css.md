---
title: CSS 实现垂直居中
date: 2016-06-29 23:14:02
tags:
  - CSS
  - 前端
categories:
  - 思考总结
---

我们有这样一个结构的 HTML：

``` html
<div class="parent">
  <div class="children"></div>
</div>
```

如果我们要实现 `.children` 在 `.parent` 中垂直居中。

通常第一印象会想起给父元素设置相对定位，给子元素设置绝对定位。这样子元素就相对于父元素定位，再通过 `top` 与 `left` 各偏移 50% 父元素宽度，使用 `margin-*` 来修正子元素的位置。
<!--more-->

``` css
.parent {
  position: relative;
}

.chilren {
  width: $width;
  height: $height;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -$height/2;
  margin-left: -$width/2;
}
```

通过这种方式可以使得子元素在父元素中垂直居中。但是这种实现的方式需要知道子元素的宽高，以方便使用 `margin-*` 来修正之前的位置。

当不知道子元素的宽高时，这种方法就无法实现正真的垂直居中。这个时候就可以使用 `transform: translate(-50%, -50%);` 来实现子元素自身的偏移。

``` CSS
.parent {
  position: relative;
}

.chilren {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

那么不使用定位是否能够使元素垂直居中呢？

这时候我们来想想要使元素水平居中的时候，我们会怎么做？Ok，一般我们都会用 `margin: 0 auto`;那么我们就可以让 `margin-top: 50%`, 这样的效果就跟相对定位时的 `top: 50%` 的效果差不多。接着就可以使用之前使用过的 `transform` 属性来使得元素向上偏移自身高度的一半，也就是 `transform: translateY(-50%);`。

这样就可以实现不使用定位来来使得元素垂直居中了。

``` CSS
.chilren {
  margin: 50% auto 0;
  transform: translateY(50%);
}
```

除了上面的这些方法之外，还可以使用 Flexbox 布局来实现。

只需要在父元素中使用 `display: flex;`，然后在子元素上使用 `margin: auto;` 就可以实现垂直居中了。

``` CSS
.parent {
  display: flex;
}

.chilren {
  margin: auto;
}
```

另外还有几种实现垂直居中的方法，并不常见与常用，使用就不提了。

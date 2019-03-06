---
title: 从零开始制作 Hexo 主题
date: 2016-12-15 17:43:47
tags:
  - Hexo
  - 前端
  - 从零开始
categories:
  - 思考总结
---
## 写在前面
本文将会从零开始开发一个简单的博客主题。样式主要参考 [Hexo theme](https://hexo.io/themes/) 中的 [Noise](https://github.com/lotabout/hexo-theme-noise) 主题。

开始之前你需要了解：
- 模板引擎
- CSS预处理器
- Hexo 文档

本文使用的模板引擎为 [ejs](http://www.embeddedjs.com/)，使用的 CSS 预处理器为 [stylus](http://stylus-lang.com/)。这也是 hexo 项目预装了的 render 插件，如果想使用其他模板引擎或者其他 CSS 预处理器，可以安装相对应的 render 插件。例如我的 [Even](https://github.com/ahonn/hexo-theme-even) 主题使用的是 Swig 与 SCSS。

本文的代码： [theme-example](https://github.com/ahonn/theme-example) 。

<!--more-->

## 目录结构
主题目录结构以自带的 [landscape](https://github.com/hexojs/hexo-theme-landscape) 主题为例：

```
.
├── languages  语言文件，用于国际化
├── layout     页面模板文件
├── scripts    Hexo 脚本
└── source     主题资源文件，包括页面样式，脚本，字体等
```

我们在 `themes` 中新建 `theme-example` 文件夹，然后在 `theme-example` 中按照 landscape 主题的目录结构新建 `languages`，`layout`，`scripts` 与 `source` 文件夹。

## 创建布局模板
在 `layout` 中创建 `index.ejs` 文件，首页将会使用该布局模板生成 HTML 文件。

`layout/index.ejs`:

``` html
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
    <title>Home</title>
  </head>
  <body>
    <h1>Hello Word</h1>
  </body>
</html>
```

修改站点配置文件中的主题配置，使用我们刚刚创建的 `theme-example` 主题：

``` yml
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: theme-example
```

运行 `hexo server --debug` 以 debug 模式开启 Hexo 本地服务器预览，访问 [http://localhost:4000/](http://localhost:4000/)。

![Hello World](https://ahonn-me.oss-cn-beijing.aliyuncs.com/images/6up8p.jpg)

## 添加页面导航

现在我们需要在页面中添加导航，由于导航不单单会在首页出现，所以我们在 `layout` 中创建共用的布局文件 `layout.ejs`， 同时创建 `_partial/head.ejs` 保存 HTML 的 head 以及创建 `_partial/header.ejs` 文件，编写页面导航部分。

`layout/layout.ejs`:
``` html
<!DOCTYPE html>
<html>
  <%- partial('_partial/head') %>
  <body>
    <%- partial('_partial/header') %>
    <main class="main">
      <%- body %>
    </main>
  </body>
</html>
```

`layout.ejs` 文件通过 `partial()` 函数来包含其他文件，使得我们能够更好的组织代码。详见 [Templates | Hexo](https://hexo.io/docs/templates.html#Partials)。

`layout/_partial/head.ejs`:
``` html
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
  <title><%= config.title %></title>
</head>
```

这里使用了 `config` 变量，该变量包含的是站点配置（即站点根目录下 `_config.yml` 中的配置）。除此之外，Hexo 还提供了许多变量可在模板中使用，详见 [Variables | Hexo](https://hexo.io/docs/variables.html)。

`layout/_partial/header.ejs`:
``` html
<header class="header">
  <div class="blog-title">
    <a href="<%- url_for() %>" class="logo"><%= config.title %></a>
  </div>
  <nav class="navbar">
    <ul class="menu">
      <li class="menu-item">
        <a href="/" class="menu-item-link">Home</a>
      </li>
      <li class="menu-item">
        <a href="/archives" class="menu-item-link">Archive</a>
      </li>
    </ul>
  </nav>
</header>
```

接着我们清空 `index.ejs` 中的内容，并添加 `<h2>Hello World</h2>`。在 `layout` 目录下的 `index.ejs` 会自动继承 `layout.ejs`，并将其中的内容填入 `<%- body %>` 的位置。我们将得到一个有导航菜单的 Hello World 页面。

![Index](https://ahonn-me.oss-cn-beijing.aliyuncs.com/images/v7x9h.jpg)

## 添加主题配置文件

实际上我们需要让导航菜单根据我们的需要显示不同的项，上面这种写法不方便修改。所以我们会在主题的配置文件中添加导航菜单的配置。在 `thmem-demo` 下新建主题的配置文件 `_config.yml`，在其中添加需要配置的字段。然后可以通过 `theme` 这个变量来拿到该配置文件中的配置。

`theme-example/_config.yml`:

``` yml
menu:
  Home: /
  Archives: /archives
```

这样我们就可以在 `header.ejs` 中使用 `theme.menu` 获取到导航菜单的设置。将 `header.ejs` 修改为：

``` html
<header class="header">
  <div class="blog-title">
    <a href="<%- url_for() %>" class="logo"><%= config.title %></a>
  </div>
  <nav class="navbar">
    <ul class="menu">
      <% for (name in theme.menu) { %>
        <li class="menu-item">
          <a href="<%- url_for(theme.menu[name]) %>" class="menu-item-link"><%= name %></a>
        </li>
      <% } %>
    </ul>
  </nav>
</header>
```

当需要在导航中添加链接的时候就可以在配置文件中直接添加，例如添加 Github 的链接：

``` yml
menu:
  Home: /
  Archives: /archives
  Github: https://github.com/ahonn
```

除此之外还可以添加其他需要的配置，例如 RSS，评论等等。

## 添加首页文章列表
接着我们完善首页的模板，使其能够显示文章列表。前面已经说过 Hexo 提供了各种有用的变量，在这里将会使用到 `page` 这个变量。`page` 会根据不同的页面拥有不同的属性。具体有什么属性，可以获取到哪些数据可以查看[这里](https://hexo.io/docs/variables.html#Page-Variables)。

那么这里我们会使用 `page` 变量的 `posts` 属性拿到文章数据的集合。编辑 `index.ejs` 文件：

``` html
<section class="posts">
  <% page.posts.each(function (post) { %>
    <article class="post">
      <div class="post-title">
        <a class="post-title-link" href="<%- url_for(post.path) %>"><%= post.title %></a>
      </div>
      <div class="post-content">
        <%- post.content %>
      </div>
      <div class="post-meta">
        <span class="post-time"><%- date(post.date, "YYYY-MM-DD") %></span>
      </div>
    </article>
  <% }) %>
</section>
```

从 `page.posts` 中获取单篇文章的数据，并获取文章的标题，内容等数据填充到模板中。处理文章创建时间的时候使用了 `date()` 函数，这是 Hexo 提供的时间处理的[辅助函数](https://hexo.io/docs/helpers.html#date)。本文中使用到的函数如无特别说明，即为 Hexo 的辅助函数。

### 文章摘录

由于首页显示文章内容时使用的是 `post.content`，即文章的全部内容。所以首页会显示每一篇文章的内容，实际上我们并不想在首页显示那么多内容，只想显示文章的摘录。

Hexo 提供了 `excerpt` 属性来获取文章的摘录部分，不过这里需要在文章中添加一个 `<!--more-->` 标记。添加了这个标记之后，`post.excerpt` 将会获取到标记之前的内容。如果没有这个标记，那么 `post.excerpt` 会是空的。所以我们可以把首页文章内容部分的 `post.content` 替换成 `post.excerpt`。

``` html
<div class="post-content">
  <%- post.excerpt %>
</div>
```

## 添加页面样式
到目前为止，我们完成了首页的页面结构，但是并没有添加样式，所以看起来很丑。我们在 `source` 文件中创建一个 `css` 文件夹来存放样式文件。

由于 Hexo 在新建项目的时候会安装 `hexo-renderer-stylus` 这个插件，所以我们无需其他步骤，只需要将样式文件放到 `css` 文件夹中。Hexo 在生成页面的时候会将 `source` 中的所有文件复制到生成的 `public` 文件中，并且在此之前会编译 styl 为 css 文件。

在 `css` 文件夹中创建 `style.styl`，编写一些基础的样式，并把所有样式 `import` 到这个文件。所以最终编译之后只会有 `style.css` 一个文件。创建 `_partial/header.styl` 与 `_partial/post.styl` 存放页面导航以及文章的样式，并且在 `style.styl` 中 `import` 这两个文件。

`_partial/header.styl`:

``` stylus
.header {
  margin-top: 2em
  display: flex
  align-items: baseline
  justify-content: space-between

  .blog-title .logo {
    color: #AAA;
    font-size: 2em;
    font-family: "Comic Sans MS",cursive,LiSu,sans-serif;
    text-decoration: none;
  }

  .menu {
    margin: 0;
    padding: 0;

    .menu-item {
      display: inline-block;
      margin-right: 10px;
    }

    .menu-item-link {
      color: #AAA;
      text-decoration: none;

      &:hover {
        color: #368CCB;
      }
    }
  }
}
```

`_partial/post.style`:

``` stylus
.post {
  margin: 1em auto;
  padding: 30px 50px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 0 2px #ddd;
}

.posts  {
  .post:first-child {
    margin-top: 0;
  }

  .post-title {
    font-size: 1.5em;

    .post-title-link {
      color: #368CCB;
      text-decoration: none;
    }
  }

  .post-content {
    a {
      color: #368CCB;
      text-decoration: none;
    }
  }

  .post-meta {
    color: #BABABA;
  }
}
```

`style.styl`:

``` stylus
body {
  background-color: #F2F2F2;
  font-size: 1.25rem;
  line-height: 1.5;
}

.container {
  max-width: 960px;
  margin: 0 auto;
}

@import "_partial/header";
@import "_partial/post";
```

最后，我们需要把样式添加到页面中，这里使用了另外一个辅助函数 [`css()`](https://hexo.io/docs/helpers.html#css):

`layout/_partial/head.ejs`
``` html
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
  <title><%= config.title %></title>
  <%- css('css/style.css') %>
</head>
```

至此，我们会看到站点的首页是这个样子的：

![Home Page](https://ahonn-me.oss-cn-beijing.aliyuncs.com/images/z38nr.jpg)

**注意，这里会报错。原因是生成文章页时没有找到对应的模版，所以使用了首页的模版，但文章页并没有 `page.posts` 这个属性（undefined 没有 each 方法）。新建 post.ejs 即可解决，或直接跳过直到完成文章页模版。**

## 添加分页
在站点的 `source/_post/` 目录下存放的是我们的文章，现在我们把原本的 `hello-world.md` 复制黏贴 10+ 次，再查看站点首页。会发现，首页只显示了 10 篇文章。

首页显示的文章数量我们可以通过站点配置文件中的 `per_page` 字段来修改，但是我们不可能把所有文章都放在一页，所以我们现在来添加文章列表的分页。

新建 `_partial/paginator.ejs`:

``` html
<% if (page.total > 1){ %>
  <nav class="page-nav">
    <%- paginator({
      prev_text: "&laquo; Prev",
      next_text: "Next &raquo;"
    }) %>
  </nav>
<% } %>
```

在 `index.ejs` 中添加这个文件的内容：

``` html
...
</section>
<%- partial('_partial/paginator') %>
```

这里我们使用到了另外的一个辅助函数 [`paginator`](https://hexo.io/docs/helpers.html#paginator)，它能够帮助我们插入分页链接。

## 添加文章详情页
文章详情页对应的布局文件是 `post.ejs`，新建 `post.ejs`:

``` html
<article class="post">
  <div class="post-title">
    <h2 class="title"><%= page.title %></h2>
  </div>
   <div class="post-meta">
    <span class="post-time"><%- date(page.date, "YYYY-MM-DD") %></span>
  </div>
  <div class="post-content">
    <%- page.content %>
  </div>
</article>
```

由于这里是文章的模板，所以变量 `page` 表示的是文章的数据，而不是首页的文章数据集合。

## 添加归档页
创建归档页使用的模板文件 `archive.ejs`:

``` html
<section class="archive">
  <ul class="post-archive">
    <% page.posts.each(function (post) { %>
      <li class="post-item">
        <span class="post-date"><%= date(post.date, "YYYY-MM-DD") %></span>
        <a class="post-title" href="<%- url_for(post.path) %>"><%= post.title %></a>
      </li>
    <% }) %>
  </ul>
</section>
<%- partial('_partial/paginator') %>
```

其实结构跟首页差不多，只是不显示文章内容而已。添加归档页的样式：

`css/_partial/archive.styl`:

``` stylus
.archive {
  margin: 1em auto;
  padding: 30px 50px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 0 2px #ddd;

  .post-archive {
    list-style: none;
    padding: 0;

    .post-item {
      margin: 5px 0;

      .post-date {
        display: inline-block;
        margin-right: 10px;
        color: #BABABA;
      }

      .post-title {
        color: #368CCB;
        text-decoration: none;
      }
    }
  }
}
```

## 国际化
还记得我们一开始创建的 `languages` 文件夹吗？没错，它是用来添加多种语言，用于 i18n 的。站点的语言设置为站点配置文件中的 `language`。

当该字段为空时，默认使用的是 `languages/default.yml` 这个文件。那么现在我们来添加这个文件，我们决定主题的默认语言是英文：

``` yml
Menu:
  Home: Home
  Archives: Archives
  Github: Github

Paginator:
  Prev: Prev
  Next: Next
```

目前我们需要主题根据选择的语言自动修改的有上面这些，接着我们需要修改 `header.ejs` 与 `paginator.ejs` 这两个文件：

`_partial/header.ejs`
``` html
<header class="header">
  <div class="blog-title">
    <a href="<%- url_for() %>" class="logo"><%= config.title %></a>
  </div>
  <nav class="navbar">
    <ul class="menu">
      <% for (name in theme.menu) { %>
        <li class="menu-item">
          <a href="<%- url_for(theme.menu[name]) %>" class="menu-item-link"><%- __('Menu.' + name) %></a>
        </li>
      <% } %>
    </ul>
  </nav>
</header>
```

`_partial/paginator.ejs`:
``` html
<% if (page.total > 1){ %>
  <nav class="page-nav">
    <%- paginator({
      prev_text: "&laquo;" + __('Paginator.Prev'),
      next_text: __('Paginator.Next') + "&raquo;"
    }) %>
  </nav>
<% } %>
```

修改之后其实与之前相比没有什么变化，起码看起来是。现在我们添加一个中文的文件：

`languages/zh-CN.yml`
``` yml
Menu:
  Home: 首页
  Archives: 归档
  Github: 交友

Paginator:
  Prev: 上一页
  Next: 下一页
```

然后我们将站点配置文件中的 `language` 字段修改为 `zh-CN`（与 `zh-CN.yml` 文件名相同）。再次访问站点之后就会发现导航与分页部分的文字变成了中文。

## 最后总结

如果你有耐心看我废话了这么多的话，恭喜你，你应该对怎么去写一个 Hexo 主题有了一定的了解。其实说白了，Hexo 就是把那些 Markdown 文件按照不同的布局模板，填上对应的数据生成 HTML 页面，复制 `source` 中的到生成的 `public` 文件夹中，中间过程会把需要编译的 stylus/less/sass 等文件编译。

本文并没有提及有关页面 JavaScript 的部分，实际上与写 CSS 样式相同。在 `source/js` 中写 JavaScript 脚本，然后在模板中引入即可。

感谢阅读，希望对你有所帮助。

---
title: 使用 Nokogiri 解析 HTML
date: 2016-05-28 22:26:29
tags:
  - Nokogiri
  - Ruby
categories:
  - 技术文章
---

Nokogiri 是 Ruby 的一个 HTML/XML 文件的解析库。在需要解析 HTML/XML 文件获取数据时，它是一个很好的选择。

## 解析 HTML 文档
使用 `Nokogiri` 解析 HTML 将会生成 `Nokogiri documens`。
生成该对象的方式有三种，分别是通过字符串解析，通过文件解析，通过网络解析。

### 通过字符串解析
通过字符串解析，即是将字符串当作函数的参数传给 `Nokogiri::HTML` 函数。
```ruby
doc = Nokogiri::HTML("<html><body><h1>Ahonn</h1></body></html>")
```
<!--more-->

### 通过文件解析
通过文件解析需要打开文件，并将文件内容当作参数。
```ruby
doc = File.open("index.html") { |f| Nokogiri::HTML(f) }
```

### 通过网络解析
这是最常用的形式，即使用 `open-uri` 打开对应的网址，并返回字符串给 `Nokogiri`。
```ruby
require "open-uri"
doc = Nokogiri::HTMl(open("http://www.ahonn.me"))
```

## 搜索 HTML 文档
Nokogiri 提供 xpath 以及 css 选择器这两种方式来搜索 HTML 文档，使得我们能够获取到对应的需要的节点及数据。

`xpath` 方法以及 `css` 方法返回的是一个节点结果集。

```ruby
doc = Nokogiri::HTML(open("http://www.ahonn.me"))

doc.xpath("//title")

doc.css(".nav-list a")

# ['<a href="/" target="_self" class="nav-list-link active">Home</a>',
# '<a href="/archives/" target="_self" class="nav-list-link">Archives</a>',
# '<a href="/tags/" target="_self" class="nav-list-link">Tags</a>',
# '<a href="/about/" target="_self" class="nav-list-link">About</a>']
```
### 获取单个结果
如果想要返回单个结果，可以使用 `at_xpath` 或者 `at_css` 方法来获取结果集中的第一个元素。
就是说返回的不再是结果集，而是元素节点。

```ruby
doc.at_css(".nav-list a")
# <a href="/" target="_self" class="nav-list-link active">Home</a>
```
### 获取元素属性
还可通过 `.` 或者索引来获取元素的属性：
```ruby
links = doc.css(".nav-list a")

puts links.length # 4
puts links[0].text # Home
puts links[1]['href'] # /archives/
```

### 限制选择器
Nokogiri 还提供了自定义筛选的限制选择器，返回结果集中符合条件的元素：
```ruby
links = doc.css(".nav-list a").select{ |link| link['href'] == "/archives/" }

links.each { |link| puts link.text }  # Archives
```

---
title: PHP cURL 库的简单使用
date: 2015-12-19 23:50:12
tags:
  - PHP
categories:
  - 技术文章
---

> 之前写 PHP 的爬虫的时候就有用到 cURl 扩展，然后前几天在写 `zhihu-php` 的时候也用到了这个，也觉得这个也是用得比较多的一个东西，所以就上网又学习了一下，就顺手把它写下来了。

cURL 是一个功能强大的库，支持很多不同的协议、选项，能提供 URL 请求相关的各种细节信息。常用于网页、数据采集。

## 安装
可以通过 `phpinfo()` 来输出 PHP 的配置信息，搜索查看是否开启了 cURL 库。

**windows**
- 将 PHP 安装文件夹下的 `php_curl.dll`，`libeay32.dll`，`ssleay.dll` 复制到 `system32` 文件夹下。
- 将 PHP.ini 中的 `extension=php_curl.dll` 前的 `;` 分号去掉。
- 重启服务器。
<!--more-->

**linux**
Ubuntu 上通过 `apt-get` 安装的 PHP 默认已经启用。若无，具体安装过程Google。

## 基本使用
通过 `curl_init()` 初始化一个 cURL 对象，然后通过 `curl_setopt()` 设置传输的选项，使用 `curl_exec()` 执行该 cURL 会话，最后通过 `curl_close()` 关闭这个会话

**简单的抓取网页**
``` php
<?php
$url = 'http://www.ahonn.me';
// 初始化一个 cURL 会话
$ch  = curl_init($url);
// 设置传输选项，这里设置的是返回的数据不直接输出
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// 执行该会话，并保存到 $content
$content = curl_exec($ch);
// 关闭该会话
curl_close($ch);
// 输出抓取的网页
echo $content;
```

**使用post方式**
通过 `get` 方式获取时，可以直接在 `$url` 中直接写入。而当需要使用 `post` 方式获取数据时，需要通过以下设置来开启 post 并设置 post 的数据。

``` php
// 开启 post
curl_setopt($ch, CURLOPT_POST, 1);
// 设置 post 的数据
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
```

其中的 `$data` 即是需要 post 的数据。

**设置header**
有些网页需要在请求中包含头信息，否则将抓取不到你需要的信息，那么可以通过下面的代码来设置：
``` php
// 头信息数组
$header = array(
		"Host: www.ahonn.me",
		"Accept: text/html, application/xhtml+xml, image/jxr, */*",
		"User-Agent: Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36"
);
// 设置header
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
```

设置头信息可以通过数组的形式，然后通过设置 `CURLOPT_HTTPHEADER` 来加入头信息。也可以单个去设置，例如
- `CURLOPT_USERAGENT`：设置 User-Agent
- `CURLOPT_REFERER`：设置 Referer

等等

**设置cookie**
有些网页需要登录后才可以抓取到，这时候就需要使用 cookie 来模拟登录。设置 cookie 可以在上面的 $header 数组中与头信息设置相同的方法来将 cookie 加入。也可以使用下面的 `curl_setpot` 选项来设置：
``` php
	// 设置 cookie，$cookie 是一个字符串
	curl_setopt($ch, CURLOPT_COOKIE, $cookie);
```

也可以通过文件的形式将 cookie 写入：
``` php
	curl_setopt($ch, CURLOPT_COOKIEFILE, $cookiefile);
```

**禁用SSL验证**
有时候在抓取 Https 链接的时候以正常的方式去抓取会报错，此时需要在 cURL 会话中设置:
``` php
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
```
通过上面的设置，可以禁用SSL证书的验证。

以上即是目前我已经简单使用过的 cURL 库的内容，cURL 库还可以实现多线程抓取，实现 IP 代理等。其他内容会在之后的使用中学习到。

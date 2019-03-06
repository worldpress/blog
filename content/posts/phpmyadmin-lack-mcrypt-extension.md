---
title: phpmyadmin 缺少 mcrypt 扩展
date: 2015-11-22 12:00:00
tags:
  - PHP
  - Ubuntu
categories:
  - 思考总结
---
> 记录，以便下次所需。

今天重装了腾讯云上面的服务器，安装的是Ubuntu server 14.04。搞完apache2 + mysql + PHP 后，安装了phpmyadmin来作为数据库管理。
登录之后发现报错：缺少 mcrypt 扩展。上网查了一下，发现需要安装php-mcrypt、libmcrypt、libmcrypt-devel这三个。

#### 安装mcrypt
	sudo apt-get install php-mcrypt libmcrypt libmcrypt-devel

安装后重启apache2服务器后发现依然报错，后面在网上找到了解决办法。原来是在`/etc/php5/apache2/conf.d`下缺少一个`20-mcrypt.ini`。该文件是`mcrypt.ini`的链接。
但是不知道是不是因为是版本不同的关系，这个文件的路径与搜索到的解决方案中不同。我的路径是：`/etc/php5/mods-available/mcrypt.ini`
<!--more-->

#### 链接mcrypt.ini
	sudo ln -s /etc/php5/mods-available/mcrypt.ini 20-mcrypt.ini


这次重启apache2服务器后不报错了。

#### 重启apache2
	sudo service apache2 restart

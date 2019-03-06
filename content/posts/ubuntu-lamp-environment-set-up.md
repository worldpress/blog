---
title: Ubuntu 下 LAMP环境搭建
date: 2015-08-24 12:00:00
tags:
  - Ubuntu
  - PHP
categories:
  - 技术文章
---

## 安装

### 安装apache2
```
$ sudo apt-get install apache2
```

### 安装php模块
```
$ sudo apt-get install php5
```


### 安装Mysql
```
$ sudo apt-get install mysql-server
$ sudo apt-get install mysql-client
```

<!--more-->
### 安装其他模块
```
$ sudo apt-get install libapache2-mod-php5
$ sudo apt-get install libapache2-mod-auth-mysql
$ sudo apt-get install php5-mysql
$ sudo apt-get install php5-gd
```

### 测试Apache
浏览器访问 [http://localhost/](http://localhost/)

页面显示It Works！即为Apache服务器成功安装运行

### 修改权限

```
$ sudo chmod 777 /var/www/html
```

### 安装phpmyadmin
```
$ sudo apt-get install phpmyadmin
```

安装过程选择apache2,输入密码。

### 测试phpmyadmin
```
$ sudo ln -s /usr/share/phpmyadmin /var/www/html
```

浏览器访问 [http://localhost/phpmyadmin](http://localhost/phpmyadmin),并登录。

## 配置

### 启用mod_rewrite模块
```
$ sudo a2enmod rewrite
```

启用后重启Apache服务器：

```
$ sudo service apache2 restart
```

### 设置Apache支持 .htm .html .php
```
$ sudo gedit /etc/apache2/apache2.conf&
```

打开并添加：`AddType application/x-httpd-php .htm .html .php`

### 测试PHP网页
在/var/www/html下新建mysql_test.php:

``` php
<?php
$link = mysql_connect("localhost", "root", "password");
if(!$link)
  die('Could not connect: ' . mysql_error());
else
  echo "Mysql 配置正确!";
mysql_close($link);
?>
```

访问 [http://localhost/mysql_test.php](http://localhost/mysql_test.php)，显示“Mysql配置正确”即完成

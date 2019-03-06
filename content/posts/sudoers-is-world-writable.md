---
title: sudoers is world writable
date: 2015-08-30 12:00:00
tags:
  - Linux
categories:
  - 思考总结
---
> 记录以避免再次犯错

## 前因
今天修改.bashrc中的环境配置时，不小心把$PATH删除了。后来发现后添加回去后Terminal中出现如下错误：

	sudo: /etc/sudoers is world writable
	sudo: no valid sudoers sources found, quitting

<!--more-->

这是因为sudoers的权限不对而出现的问题。

## 后果
在网上搜索后知道了解决方法是进入ubuntu的recovery mode将`/etc/soduers`的权限改为0440.

然而这需要在recovery下使用root帐号，由于我没有设置root密码所以无法解决。

最后终于找到了解决的办法，为了防止下次再次如此麻烦，将其记录下来。

#### 具体步骤：
- 开机按`Esc`进入GRUB，选择第二项
- 选择recovery mode（一般是第二项），按`e`进入编辑
- 将其中的`ro recovery nomodeset` 改为 `rw single init=/bin/bash`
- 按F10，进入单用户模式，即root用户
- 输入 `chomd 0440 /etc/sudoers` 修改权限
- 按Ctrl + Alt + Del 重启

重启后就可以使用sudo。这里出现了一个提示，进入/etc目录删除sudoers.d文件夹即可解决。

---
title: 转投 Neovim
date: 2017-03-27 11:10:06
tags:
  - Vim
categories:
  - 折腾工具
---

很久之前就听说过 Neovim，但一直没有怎么了解过。昨天下午折腾了一下，彻底转投 Neovim 了。

虽然说这两货的差别目前还不是很大，但是 Neovim 实现了嵌入式终端模拟器，Excited! 各种 REPL 插件统统都可以卸载了！

<!--more-->

## 迁移配置文件
Neovim 配置完全兼容原来的 `.vimrc`，只需要：

``` bash
mkdir -p ${XDG_CONFIG_HOME:=$HOME/.config}
ln -s ~/.vim $XDG_CONFIG_HOME/nvim
ln -s ~/.vimrc $XDG_CONFIG_HOME/nvim/init.vim
```

## 使用 ale 代替 syntastic
老早就觉得 `syntastic` 同步检查代码好难用，这下换成 `ale` 舒服多了。有之前使用 atom 时自带的代码检查的感觉。

(Vim 8 好像也已经提供了异步 API，但是我等到换成 Neovim 才知道..)

## 把 Leader 改成空格
其实是看了 [Vim 高效率配置导论](https://zhuanlan.zhihu.com/p/25905625) 这篇文章之后试着改的，改完发现空格比起原先的 `,` 好用多了。让大拇指动了起来。

然后切换 buffter 的快捷键就映射成了 `<Space> + n/m`，简直不要太顺手。

## 使用 Spacegray 主题
之前使用的 `molokai` 看久了有点视觉疲劳，发现之前在用 `sublime text` 时使用的 `Spacegray` 也有 Vim 版本，果断换之。（折腾高亮主题是永恒的.. ）

## 优化难用的缩进调整
在 Visual 模式下调整缩进很不好用，`v>` 之后又得重新选中，虽然说可以 `v3>` 之类的，但是需要去计算多少个缩进，看起来并不是很明显。

遂，添加了下面这两个 mapping：

```
vnoremap < <v
vnoremap > >v
```

这样映射之后我就可以 `v>>>` 去缩进了，好用到不行！

## Vim 使用总结
使用 Vim 也差不多一个来月了，越来越发现 Vim 的便利之处，虽然说折腾配置插件花的时间会久一点。但是折腾完之后效率提高还是蛮多的，以至于现在在别的编辑器里下意识的用 Vim 模式，发现没有之后用方向键或者鼠标去移动都觉得超级慢。

开始理解 Vim 学习路线那张图表的意思了～

> 我的 Vim 配置：[vimrc](https://github.com/ahonn/vimrc)



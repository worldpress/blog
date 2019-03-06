---
title: Vim 全局搜索插件：ctrlsf.vim
date: 2017-06-29 18:05:46
tags:
  - Vim
categories:
  - 折腾工具
---

这两天一直在看文档看源码，Vim 上用的 Ack.vim 做全局搜索，但是用起来蛮难用的。

经过一番搜索，找到了国人写的全局搜索的插件：ctrlsf.vim，经过配置之后用了起来，感觉蛮好用的。

具体效果可以查看 [ctrlsf.vim](https://github.com/dyng/ctrlsf.vim)

<!--more-->

## 安装
ctrlsf 是依赖 ack/ag/pt/rg 之类的，所有必须先安装其中之一。所以我们先安装 ack

```bash
$ brew install ack
```

其他系统安装方式查看：https://beyondgrep.com/install/

然后安装 ctrlsf.vim 插件

```viml
Plug 'dyng/ctrlsf.vim'
```

运行 `:PlugInstall` 进行安装

## 配置
我把 `Ctrl-f` 映射到了 `:CrtlSF<Space>`，这样就可以直接 `Ctrl-f` 然后直接输入、回车进行全局搜索了。

```viml
nnoremap <C-f> :CtrlSF<Space>
```

ctrlsf 插件还提供了两种模式：normal/compact。
normal 模式是左半屏为搜索结果，右半屏为预览窗口。而 compact 模式则是类似于 ctrlp 的 quickfix 窗口模式。
个人还是比较喜欢 quick 窗口模式，可以通过 `let g:ctrlsf_default_view_mode = 'compact'` 设置为默认 compact 模式。

此外通过设置 `let g:ctrlsf_ignore_dir` 指定要搜索时忽略的目录。

## 使用
设置了快捷键映射之后就可以愉快的 `C-f` 输入回车搜索了。然后可以在搜索结果中移动，预览，打开。还能够按 M 更换显示模式。

具体可以查看：[Key Maps](https://github.com/dyng/ctrlsf.vim#key-maps)


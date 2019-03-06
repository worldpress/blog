---
title: Vim 折腾记
date: 2017-02-19 22:37:54
tags:
  - Vim
categories:
  - 折腾工具
---

昨天在微信读书上面看到了池建强的《MacTalk 人生元编程》，然后花了差不多一天看完，其中有篇有关于 Vim 的文章提起了我对这个编辑器的再一次兴趣（对的，我对它感兴趣很多次了，每次都懒..）。

一直懒得去慢慢配置它，又不想用别人的配置。自己用的编辑器还是想自己折腾，然后今天就趁着我对这个还有点热度赶紧折腾起来。

## MacVim
其实在命令行里面直接写代码还有有些不习惯的，所以选了 MacVim 这个 GUI 版本。这样又可以与其他编辑器一样单独打开，想小改代码的时候又可以直接打开命令行搞。

在 MacTalk 的文章里面有提到 Vim 中文版本的[帮助文档](http://sourceforge.net/projects/vimcdoc/files/latest/download)，遂下载之。果然还是中文的比较浅显易懂。

以前看别人的 `.vimrc` 配置，里面有些编辑器的基本配置，也不知道是哪里查的。原来这些配置可以在编辑器中输入 `:help options` 进行查看。

<!--more-->

### 缩进
关于缩进的配置，主要设置了 `autoindent`, `smartindent` 和 `expandtab` 这三个选项。

- `autoindent` 选项根据上一行决定新行的缩进
- `smartindent` 选项智能自动缩进
- `expandtab` 选项将 tab 转换为空格

```
set autoindent
set smartindent
set expandtab
```

### 行号
显示行号是硬需求，但是与其他编辑器不同，在 vim 上还有相对行号。

```
set number
set relativenumber
```

## 插件
显而易见，手动安装 vim 插件是很麻烦很麻烦的。与 sublime text 之类的类似，vim 同样有类似的插件管理器 [Vundle](https://github.com/VundleVim/Vundle.vim)。

创建文件夹 `~/.vim` 和配置文件 `~/.vimrc`，并安装 Vundle:

``` bash
$ git clone https://github.com/gmarik/vundle.git ~/.vim/bundle/vundle
```

为了方便管理再新建一个 `.vimrc.bundles` 来单独存放插件列表：

```
set nocompatible    " be iMproved, required
filetype off        " requried
set rtp+=~/.vim/bundle/vundle/

call vundle#begin()

" Let Vundle manage Vundle
Bundle 'gmarik/vundle'

" .... 其他插件

call vundle#end()
" required
filetype plugin indent on
```

以后添加插件的时候只需要在这个文件里面添加一行：

```
Bundle 'xxx'
```

安装插件输入 `:BundleInstall` 命令即可，卸载插件时删除对应的配置并运行 `:BundleClean` 删除插件。

### 括号补全
第一次用的时候，输入 `(` 居然没有自己蹦出来另外一个 `)`。这不科学，讲道理这个是一定要的。

发现很多人用的是 [delimitMate](https://github.com/Raimondi/delimitMate) ，添加 `Bundle 'delimitMate'` 到 `.vimrc.bundles`，运行 `BundleInstall`。

安装完直接就可以自动补全括号了。

### Emmet
很多浏览器都支持 Emmet 插件，vim 同样也有。但这个 Emmet 是第三方的，叫 [Emmet.vim](https://github.com/mattn/emmet-vim/)。

安装完之后主要是设置一下出发的快捷键，默认的快捷键是 `Ctrl + y`。
我把快捷键修改成 `Ctrl + e` 比较顺手。

```
" Emmet.vim
let g:user_emmet_expandabbr_key = '<c-e>'
```

### 目录树
目录树就基本上也就是使用 [NERDTree](https://github.com/scrooloose/nerdtree)。

开启目录树的快捷键修改为 `Ctrl + b`，然后当 vim 只剩目录树显示的时候自动退出。
```
" NERDTree
map <c-b> :NERDTreeToggle<CR>
autocmd vimenter * NERDTree
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTreeType") &&b:NERDTreeType == "primary") | q | endif
```

### 代码补全
补全用的就是大名鼎鼎的 [YouCompleteMe](https://github.com/Valloric/YouCompleteMe) 了。

关于这个插件网上有很多插件，我就不啰嗦了。这里主要是抄的百度 EFE 的配置：

```
" YouCompleteMe
" http://efe.baidu.com/blog/vim-javascript-completion/#youcompleteme
let g:ycm_min_num_of_chars_for_completion = 3
let g:ycm_autoclose_preview_window_after_completion=1
let g:ycm_complete_in_comments = 1
let g:ycm_key_list_select_completion = ['<c-n>', '<Down>']
let g:ycm_key_list_previous_completion = ['<c-p>', '<Up>']
" Use tab
function! TabFunction ()
    let line = getline('.')
    let substr = strpart(line, -1, col('.')+1)
    let substr = matchstr(substr, "[^ \t]*$")
    if strlen(substr) == 0
        return "\<tab>"
    endif
    return pumvisible() ? "\<c-n>" : "\<c-x>\<c-o>"
endfunction
inoremap <tab> <c-r>=TabFunction()<cr>

let g:ycm_semantic_triggers = {
    \   'css': [ 're!^\s{2}', 're!:\s+'],
    \   'html': [ '</' ],
    \ }

```

## 总结
折腾了一下午，终于算是搞定了。其实过程还是蛮好玩的，有机会还想写写插件玩玩。抛弃 VS Code，开始 Vim 之旅感。

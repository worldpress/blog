---
title: Python curses 模块
date: 2016-01-23 20:40:20
tags:
  - Python
categories:
  - 技术文章
---

Python 中的 curses 模块封装了 C 语言的 curses。curses 是一个能够提供基于文本终端窗口功能的动态库。它可以创建和管理一个窗口，使用8中不同的颜色，提供鼠标以及键盘支持。与 Tkinter 不同的是 curses 是基于终端的。

**curses 支持 Unix/Linux 系统，目前不支持 Windows**
<!--more-->

## 基本语法
- `initscr()`
	初始化 curses, 在任何代码执行钱都需要先初始化 curses。
- `noecho()`
	关闭屏幕回显，即读取字符仅在适当的环境下输出。相对应的是 `echo()`。
- `cbreak()`
	程序立即反应，即不需要按回车。相对应的是 `nocbreak()`。
- `keypad(bool)`
	键盘模式，即读取键盘输出。`keypad(1)` 为开启，`keypad(0)` 为关闭。
- `endwin()`
	恢复默认设置，即回到终端之前的状态。
- `newwin(height, width, begin_y, begin_x)`
	在原有程序中创建新窗口，类似与分屏。
- `addscr(y, x, str, attr)`
	显示文本，若没有坐标，字符将显示在上一次操作完的位置；若没有属性，字符将使用默认的属性显示。

	**属性：**可使用 `color_pair(int)` 方法获取一对颜色。使用 `init_pair(n, f, b)` 修改颜色对 n，使用 f 为前景色，使用 b 为背景色。

	curses 内置了8种基本颜色：`COLOR_RED`, `COLOR_BLACK`, `COLOR_GREEN`, `COLOR_YELLOW`, `COLOR_BULE`, `COLOR_MAGENTA`, `COLOR_CYAN`, `COLOR_WHITE`。使用颜色前需要调用 `start_color()`。
- getch()
	获取输入一个字符串，返回一个 0~255 之间的整数，表示字符的 ASCII 值。
- refresh()
	刷新窗口，变更窗口后需要调用

## 基本使用
``` python
import curses

# 初始化 curses
screen = curses.initscr()
# 开启键盘模式
screen.keypad(1)
# 关闭屏幕回显
curses.noecho()

# 开启颜色设置，并设置颜色对
curses.start_color()
curses.init_pair(1, curses.COLOR_CYAN, curses.COLOR_RED)
curses.init_pair(2, curses.COLOR_BLUE, curses.COLOR_WHITE)

# 显示文本
screen.addstr(12, 25, "Hello, Ahonn!")
while True:
	# 读取键盘输入
	key = screen.getch()

	# 当输入 c 时，显示 you input 'c', 使用颜色对 1
	if key == ord('c'):
		screen.addstr(12, 25, "you input 'c' ", curses.color_pair(1))
	# 当输入 b 时，显示 you input 'b'，使用颜色对 2
	elif key == ord('b'):
		screen.addstr(12, 25, "you input 'b' ", curses.color_pair(2))
	# 当输入 q 时退出循环
	elif key == ord('q'):
		break
# 刷新窗口
screen.refresh()
# 退出到终端之前的状态
curses.endwin()
```

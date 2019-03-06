---
title: Python 多线程初步了解
date: 2016-02-20 20:56:39
tags:
  - Python
categories:
  - 技术文章
---
这两天在写 [Nada](https://www.github.com/ahonn/Nada) 的下载功能，遇到一个问题，在下载歌曲的时候整个界面都会卡住，必须等待下载完成才能够恢复，因为写的时候是直接顺序执行的，没有多线程。之前在写播放功能的时候是参考了别人的代码，自己其实对多线程部分不是很了解。然后趁着晚上了解一下 Python 的 thread 和 treading 模块。

## Python 多线程支持
Pyhton 标准库提供了 thread 和 threading 模块来支持多线程，这意味着不需要重新下载这两个模块，只需要在代码中 import 这两个模块就可以了。

## thread 模块
thread 模块是以低级、原始的方式来处理和控制线程，提供了一个简单的锁（相对于 threading 模块的锁的感觉来说的确是比较简单）。相对于 threading 模块来说，thread 模块更加灵活。

<!--more-->
- `thread.start_new_thread(function, args [, kwargs])`
  创建一个新的线程，返回该线程的标识符。线程执行后将制动退出，即函数执行完毕。当遇到未处理的异常时也将退出，但不影响其他线程。
  * `function`：线程执行的函数。
  * `args`：线程执行函数的参数。
  * `kwargs`：为函数提供命名参数字典。

- `thread.exit()`
  结束当前进程，触发 SystemExit 异常。

- `thread.get_ident()`
  返回当前线程的标识符，标识符为一个非零整数。

- `thread.interrupt_main()`
  触发主线程的 KeyboardInterrupt 异常，子线程使用此方法来终端主线程。

- `thread.allocate_lock()`
  创建 thread.LockType 锁类型，即为线程锁

### thread.LockType

- `Lock.acquire([ waitflag ])`
  获取锁，返回一个布尔值，成功返回 True，否则返回 False。

  `waitflag`：默认值为非零整数，表示如果锁已经被其他线程占用，那么当前线程等待，直到其他线程释放锁，即为同步阻塞。如果将参数设置为 0，即表示当前线程会尝试获取锁，不管锁是否被占用，线程都不会等待。

- `Lock.release()`
  释放所占用的锁。

- `Lock.locked()`
  判断锁是否被占用。

## threading 模块
threading 模块是对 thread 模块的二次封装，提供更方便的 API 使用。大多数多线程使用 threading 模块编写。提供更复杂的锁（Lock & RLock），条件，事件等。

- `threading.Thread(group=None, target=None,name=None, args=(), kwargs={})`
  返回一个Thread对象，每个Thread对象代表着一个线程，可以通过start()方法，开始运行。

  * `group`：应该为 None ，该参数是留给未来的扩展时使用的
  * `target`：可调用对象（函数），在线程启动后执行
  * `name`：线程的名字，默认值为“Thread-N”，N 是一个十进制整数
  * `args`：target 调用对象的参数列表
  * `kwargs`：target 调用对象的关键字参数

- `threading.activeCount()`
  返回当前存活线程数

- `threading.currentThread()`
  返回当前 Thread 对象

- `threading.enumerate()`
  返回当前存活的 Thread 对象列表

- `threading.Lock()`
  返回一个原始锁对象

### threading.Thread
有两种方式来创建 threading.Thread 对象。一种方式是继承 Thread 类，重写父类的 run 方法，另一种方式是通过 threading.Thread() 函数创建。

- `Thread.start()`
  启动线程

- `Thread.join([timeout])`
  阻塞当前环境进程，直到调用此方法的线程终止，或者达到指定的 timeout

- `Thread.getName()` & `Thread.setName()`
  获取线程名称 & 设置线程名称

- `Thread.isAlive()`
  返回线程是否存活。返回 True 在线程开始运行直到终止。

### threading.Lock
- `Lock.acquire([blocking])`
  获取锁。`blocking` 默认为 true，阻塞直到锁被释放。当 `blocking` 为 False 时，则不阻塞。

- `Lock.release()`
  释放锁，没有返回值。当没有锁时，将会抛出 ThreadError 异常。

---
title: JavaScript 创建对象的一些姿势
date: 2016-11-30 18:52:21
tags:
  - JavaScript
  - 前端
categories:
  - 技术文章
---

## 工厂模式
在函数中创建 Object 对象，并为对象添加属性。函数返回添加属性之后的对象。

``` js
function createPerson(name, age) {
  var o = new Object()
  o.name = name
  o.age = age
  o.sayName = function () {
    console.log(this.name)
  }
  return o
}

var p = createPerson("ahonn", 21)
```

<!--more-->

但工厂模式产生的对象依旧为 Object 类型，只是在对象上添加了一些属性。

> 工厂模式虽然解决了创建多个相似对象的问题，但却没有解决对象识别的问题（即怎样知道一个对象的类型）

## 构造函数模式
由于工厂模式创建的对象没有解决对象识别的问题，出现了另外一种新模式：构造函数模式。

``` js
function Person(name, age) {
  this.name = name
  this.age = age
  this.sayName = function () {
    console.log(this.name)
  }
}

var p = new Person("ahonn", 21)
```

这里使用了 `new` 操作符，即是将 Person 函数通过构造函数的方式去调用来创建对象。

构造函数会进行下面几个步骤：
- 创建一个新对象
- 将构造函数的 this 指向新对象
- 通过 this 给对象添加属性
- 返回新对象

使用构造函数模式创建的对象可以通过 `constructor` 属性查看对象的类型。

``` js
console.log(p.constructor) // Person
```

### 构造函数也是普通函数
构造函数与普通的函数无异，也可以直接调用构造函数。但此时就不会创建新对象，函数中的 this 指向的是函数当前所在的作用域。

``` js
Person("ahonn", 21)
this.sayName() // ahonn
```

## 原型模式
通过构造函数模式创建的对象有一个问题，就是创建的对象各自拥有自己的方法，而实际上这些方法都是相同的。通过原型模式即可以将共同的属性方法放在 prototype 上。

``` js
function Person() {}

Person.prototype.name = "ahonn"
Person.prototype.age = 21
Person.prototype.sayName = function () {
  console.log(this.name)
}

var p1 = new Person()
p1.sayName() // "ahonn"

var p2 = new Person()
p2.sayName() // "ahonn"
```

对象在 prototype 上的属性是共享的，即修改一个对象的某个属性，另一个对象对于的属性值也会改变。

``` js
p1.name = "test"
p1.sayName() // test

p2.sayName() // test
```

## 构造函数与原型模式
使用原型模式创建的对象共享 prototype 上的属性，那么当有些属性不想要对象之间共享的时候，就可以结合构造函数模式与原型模式来使用。这也是最常用的创建对象的方式。

``` js
function Person(name, age) {
  this.name = name
  this.age = age
}

Person.prototype.sayName = function () {
  console.log(this.name)
}

var  p1 = new Person("ahonn", 21)
p1.sayName() // "ahonn"

var p2 = new Person("test", 12)
p2.sayName() // "test"
```

## ES6 类
在 ES6 中有类似于 Java 创建对象的方式，即通过类来创建对象。ES6 中提供了 `class` 关键字，来声明一个类型，并如上面构造函数模式的方式一样使用 `new` 来声明对象。虽然可以使用类似 Java 中的 `class` 来声明，但实际上只是给构造函数与原型模式加上了语法糖，使得代码看起来更加易读。

还是 Person 类的例子
``` js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  sayName() {
    console.log(this.name)
  }
}

var p = new Person("ahonn", 21)
p.sayName() // "ahonn"
```

通过 `class` 关键字声明 Person 类，`constructor` 函数即为 Person 类的构造函数，类属性的初始化也在其中。需要在各个对象中共享的方法也写在 `class` 中，避免了原来定义在 `prototype` 上时的撕裂感。

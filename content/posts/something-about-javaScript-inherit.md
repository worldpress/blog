---
title: JavaScript 继承的那些事
date: 2017-01-24 23:15:02
tags:
  - JavaScript
  - 前端
categories:
  - 技术文章
---

众所周知，JavaScript 的继承是实现继承，而没有 Java 中的接口继承。这是因为 JavaScript 中函数没有签名，而实现继承依靠的是原型链来实现的。

## 原型链继承

JavaScript 中通过修改对象原型指向的对象来实现继承，即是将一个对象的原型指向要继承的对象实例，从而实现继承对象的属性及方法。

<!--more-->

``` js
function SuperType() {
  this.type = 'super';
}

SuperType.prototype.getType() {
  return this.type;
}

function SubType() {
  this.type = 'sub';
}

SubType.prototype = new SuperType();

var sub = new SubType();
console.log(sub.getType()); // "sub"
```

### 原型链继承的不足
实际上，上面的代码还缺少一句代码，我们将 SubType 的原型指向了 SuperType 的实例，即`SubType.prototype.constructor` 会返回 `SuperType` 而不是 `SubType`，使用 `instanceof` 操作符返回的将是 `SuperType`。所以需要将 `SubType.prototype.constructor` 重新指向 `SubType`。

``` js
// ...
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
// ...
```

但即使是这样，原型链继承依然有两点问题：原型中的实例引用类型属性会在所有对象实例中共享，无法想 Java 的继承一样向父类的构造函数中传递参数。

## 其他继承方式

由于原型链继承存在一些不足，为了解决这些不足，JavaScript 中还有其他的几种继承的方式。

### 借用构造函数
因为原型链无法传递参数到父类的构造函数中，因此出现了这种叫做借用构造函数的技术。顾名思义，即是借用父类的构造函数在子类中进行调用。

``` js
function SuperType() {
  // ...
}

function SubType() {
  SuperType.call(this); // <- 执行父类构造函数
  // ...
}
```

借用构造函数虽然解决了构造函数传参的问题，但是当父类拥有方法时每个子类的实例都会拥有独立的方法，这个问题与单独使用构造函数模式定义类型的时候相同。

### 组合继承
类比使用构造函数模式定义类型时的解决方法（组合构造函数模式与原型模式），继承时的解决方法也类似。即组合原型链继承和借用构造函数，属性由借用构造函数的方式继承，方法由原型链继承。

实际上也就是在原型链继承的代码中添加在子类的构造函数中调用父类构造函数。

``` js
function SuperType() {
  this.type = 'super';
}

SuperType.prototype.getType() {
  return this.type;
}

function SubType() {
  SuperType.call(this);
  this.type = 'sub';
}

SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
```

### 寄生组合式继承
组合继承是常用的继承方式，但是同样的也是有不足之处：调用了两次父类的构造函数，一次在子类构造函数中调用父类构造函数，一次在实例父类对象赋值给子类的原型。

寄生组合式继承在指定子类的原型的时候不必调用父类的构造函数，而是直接使用 `Object.create()` 创建父类原型的副本。

``` js
function SuperType() {
  // ...
}

function SubType() {
  SuperType.call(this);
  // ...
}

SubType.prototype = Object.create(SuperType.prototype); // 直接使用父类原型创建副本
SubType.prototype.constructor = SubType;
```

## ES6 中的继承

ES6 引入了 `class` 关键子，可以像其他语言中一样使用 `extends` 关键字来继承。虽然能够使用 `extends` 实现继承，但实际上内部还是基于原型。

``` js
class SubType extends SuperType {
  constructor() {
    super();
    // ...
  }

  // ...
}
```

---
title: 奇怪的原型链
date: 2016-03-29 23:22:03
tags:
  - JavaScript
  - 前端
categories:
  - 技术文章
---
在 JavaScript 中一切皆为对象（Object），但是却与 Java，C++ 等语言不同，没有“类”的概念，也没有所谓的“子类”和“父类”。JavaScript 中的对象是基于原型（prototype）来实现面向对象的，靠奇怪的原型链（prototype chain）来实现继承。

## 对象与原型
在 JavaScript 中创建对象使用 `new` 关键字，而后跟着的是构造函数。在 JavaScript 中没有类的概念，所以对象的构造函数就是单纯只是个函数（function）。

<!--more-->
创建自定义构造函数并使用构造函数创建对象：
```
function Person() {
  this.name = 'ahonn';
}

var p1 = new Person();
```

单纯使用构造函数的方式来创建对象，有一个问题，那就是无法共享属性和方法，当两个对象都有一个同名的相同的方法时，方法会在每个实例上重新创建，这无疑是一种浪费。

创建函数时，函数都会有一个原型（prototype）属性，该属性是一个指针，指向一个对象。而这个对象的用途就是包含那些共享的属性和方法。prototype 就是通过调用构造函数而创建的对象实例的原型对象。

使用构造函数模式和原型模式来创建对象：
```
function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function () {
  console.log(this.name);
}

var p1 = new Person("ahonn");
var p2 = new Person("person");

p1.sayName(); // "ahonn"
p2.sayName(); // "person"
```

构造函数模式用于定义实例的属性，而原型模式用于定义方法和共享的属性。这里有一点继承的味道，如果把 prototype 当作是父类的话，那么构造函数创建的对象就是原型对象的子类。

## 继承与原型链
每个构造函数都有一个原型对象（创建函数时会有一个原型属性），原型对象中包含一个指向构造函数的指针（constructor 指向构造函数）,而实例对象中包含一个指向原型对象的内部指针（实例对象中的 [[Prototype]], 它不能被显式的访问）。

```
function Animal(name) {
        this.name = name;
}
Animal.prototype.age = 3;
Animal.prototype.sayName = function() {
    return this.name;
};

var animal = new Animal('Dog');
console.log(animal.sayName());  // "Dog"
```

以上代码中，构造函数为 Animal ，Animal.prototype 是指向 Animal 的原型对象的指针，而原型对象中 Animal.prototype.constructor 属性指向构造函数，而 Animal 的实例中 [[Prototype]] 指向构造函数原型对象。

> 在ECMA-262中定义此指针为[[Prototype]]，并不能被显式的访问到，而在Firefox,Safari和Chrome中每个对象上有一个__proto__属性。

那么如果这里面的原型对象是另一个实例对象的话，就可以使得实例与实例之间产生了关联，并且由于原型对象是另一个实例对象的关系，此时这个作为原型对象的实例对象的属性和方法变成了原型对象对应的构造函数创建的实例的“父类”。

这样层层递进，构成实例和原型间的链条，就让实例之间产生了关联，那么就实现了继承。这个就是原型链的基本概念。

实现原型继承的简单示例：
```
function Animal() {
  this.name = "Animal";
}

Animal.prototype.eat = function () {
  console.log("Animal can eating");
}

function Dog() {
  this.name = "Dog";
}

// 通过原型继承，继承 Animal 的属性和方法，创建了 Dog 与 Animal 之间的原型链
Dog.prototype = new Animal();

// 修复 Dog 对象的原型对象中的 constructor
Dog.prototype.constructor = Dog;

var dog = new Dog();

// Dog 中重写了原型中的 name 属性，即所继承的 Animal 中的 name 属性
console.log(dog.name); // "Dog";

// 同时继承了原型中的方法
dog.eat(); // "Animal can eating"
```

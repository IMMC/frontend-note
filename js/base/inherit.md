# js 继承

## 原型链的形式继承

```javascript
function superType() {
  this.data = 0;
}

superType.prototype.getData = function() {
  return this.data;
};

function subType() {
  this.subData = 1;
}

subType.prototype = new superType();
subType.prototype.getSubType = function() {
  return this.subData;
};
```

原型链的问题在于，包含引用类型的属性时，会被所有实例共享。

## 借用构造函数

为了解决引用类型的问题，提出了借用构造函数的继承形式

```javascript
function superType() {
  this.colors = [];
}

function subType() {
  superType.call(this);
}
```

借用构造函数的形式必须要把方法都写在函数里面

## 组合继承

把原型链和借用构造函数的形式组合起来的形式

```javascript
function superType() {
  this.color = [];
}

superType.prototype.getColor = function() {
  return this.color;
};

function subType() {
  superType.call(this);
}

subType.prototype = new superType();
subType.prototype.constructor = subType;
```

组合继承的方式，父类会被调用两次

## 寄生组合式继承

```javascript
function super(name) {
  this.name = name;
}

super.prototype.getName = function() {
  return this.name;
};

function sub(name) {
  super.call(this, name);
}

sub.prototype = object.create(super.prototype);
sub.prototype.constructor = sub;
```

## es6 class

es6 新增了 class 关键字。

```javascript
class parent {}

class b extends parent {
  constructor() {
    super();
  }
}
```

在 es6 中通过 extends 关键字实现继承。 ES5 的继承，实质是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到 this 上面（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。在子类的构造函数中，只有调用 super 之后，才可以使用 this 关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有 super 方法才能调用父类实例。

### 原生构造函数继承

在之前，子类无法获得原生构造函数的内部属性，通过 Array.apply()或者分配给原型对象都不行。原生构造函数会忽略 apply 方法传入的 this，也就是说，原生构造函数的 this 无法绑定，导致拿不到内部属性.
es6 可以实现对原生构造函数的继承.主要原因就是, es6 是先通过父类生成子类实例的 this, 子类再对这个 this 进行修饰, 所以可以实现继承.

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


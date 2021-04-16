# js 模块化

在 es6 出现之前，js 并没有模块化的概念。而随着前端越来越复杂，web 由页面到应用的升级。简单的 js 文件已无法满足需求。之后出现了 commonjs 用户服务端模块化编程的
规范。 AMD 适用于浏览器端的异步模块加载规范。

模块化，使得 js 编程可以拥有命名空间，可重用性，可维护性等好处。

## commonjs (cjs)

commonjs 是本地模块化的 js 规范，nodejs 的模块化就是依照 commonjs 规范设计的。通过 exports 或者 module.exports 导出。通过 require 引入。

```javascript
// a.js

exports.a = 1;

// b.js

const { a } = require('a.js');
```

在 node 中，每一个模块起始都会被包装起来，每一个模块都有一个 module 对象，指向该模块本身。export 则是对 module.exports 的引用。 node 在导入模块时会缓存模块，引入的模块是值拷贝。

```javascript
function(module, exports, require){}
```

commmonjs 本身制定的规范，就是为服务端服务的。模块从本地磁盘直接同步加载的。但对浏览器端完全不适用，从网络加载一个模块相对来说速度会很慢，而且如果同步的去处理加载模块
会阻塞渲染。

但是 commonjs 的发起人并不同意直接改造 commonjs ，以支持浏览器端。

## es

es6 规范中，正式引入了 js 模块化的标准。规范 js 的模块化。 使用 import, export 导入导出.(后续总结详细对比 commonjs)

## AMD

在 commonjs 不对异步模块加载支持的此基础上，提出了 AMD 规范，适用于浏览器的异步加载模块规范， RequireJS 则是完全实践了 AMD 规范构建处理的模块加载库。

```javascript
define(['jquery'], function($) {
  return function() {};
});
```

在 AMD 中，提倡依赖前置的方案，在一个模块中定义好依赖模块， 在前置模块加载执行完成后，再执行相应回调。

## CMD

玉伯认为 requireJs 存在以下问题：

- 执行时机问题， requireJs 的依赖模块在使用时，实际上已经执行加载完成， 使用仅仅是对 export 的引用。与 commonJs 的理念完全不一致。
- 破坏了 就近声明 原则。

但是, requireJs 作者并不接受玉伯的建议，在此基础上，玉伯实现了 sea.js。 sea.js 是按照 CMD 　规范实现的模块加载器。

CMD 　规范中，模块的执行是惰性的. 只在模块使用时再执行.

## 文章

(js 模块化历史)[https://juejin.im/post/5e3985396fb9a07cde64c489]

# 你的 default export 还好吗

## 前言

对于我们现在的 web 开发项目中，我们快乐的使用着 export/import 来进行模块化开发。我们好像完全不用担心，实际上如果项目全部使用 es6 的 module 规范，确实也不用担心什么。
但是我们也知道， es module 是
2015 年才在规范中引入。在此之前 js 规范中并没有模块化一说（当然，以前 web 也没有那么复杂）。 commonjs 就是在没有 js module 之前的一个产物。commonjs 是服务端
js 模块化系统规范。在 es6 出现之前，已经存在了大量的 commonjs 的模块，总不能要求所有的模块都迁移使用 js module 吧。并且 commonjs 和 js module 的模块化概念本质上是不同的，
这就不可避免的出现 commonjs 和 js 模块相互调用的情形。

## js export 和 exports

众所周知， es module 和 cjs module 是两个东西，之所以我们可以愉快的相互调用，全靠编译器在背后支持你（哪有什么岁月静好，只是有人替你负重前行[doge]）。首先，然我们抛开 babel,
rollup 这些东西，把自己当成一个编译器开发者，你会怎么处理相互调用的问题呢。

假设有一个 es module 编写的模块:

```javascript
//lib.js

export const a = 1;
export const b = 2;

export default () => {
  return 3;
};
```

现在交给你来处理，虽然现在大部分浏览器已经支持了 es module，但是考虑到兼容性，我们作为编译器，要把 lib.js 翻译成 cjs 的形式。首先我们看到 lib js 有两个 export，这个简单
我们把 commonjs 的 exports.xx 和 es module 的 export const xx 一一对应起来就好了啊。 然后还有个 export default, 查阅了下资料，我们知道在 es module 中我们可以认为 `export default` 是 export 了一个 default 的变量或方法。 这下就简单了，直接 exports.default = xx 不就好了，于是得到以下 cjs 的代码：

```javascript
// lib.js [cjs]
module.exports {
  a: 1,
  b: 2,
  default: function(){return 3;}
}
```

这个翻译过程看上去没什么问题，我们愉快的保存了 lib.js 的 cjs 版本。
这时候有人在项目中用到了 lib.js 他是使用的 es module 形式：

```javascript
import fn, { a, b } from 'lib';
console.log(a);
console.log(b);
console.log(fn());
```

恰好这个光荣的翻译工作还是你来做，一看题目，这还不简单，一个小小的 import, 办它。于是进行了转换：

```javascript
const { a, b } = require('lib');
const fn = require('lib').default;
console.log(a);
console.log(b);
console.log(fn());
```

好像看上去没什么问题。 但是注意这里的 default, 我们把 default 当成 exports 的一个属性导出。如果使用这种转换规则的话， 那么在 react 项目中将会，收到一堆报错。因为
`import react from 'react'` 会被翻译成 `const react = require('react').default;` , 但是 react 模块导出的对象上，并没有 default 属性。而且， 不仅仅是 react , 很多 cjs 的 lib
只会导出一个方法或者 class 类似这种：`module.exports = function() {}`。那么为了直接使用这些 cjs 的库，你只能这样写：`import * as React from 'react'`， 来整体导出使用。 这也是
之前 typescript 的处理方式。

```javascript
// lib export
export const a = 1; ===> exports.a = 1;
export default 2;  ===> exports.default = 2;

// main import
import lib from 'lib' ===> const lib = require('lib').default;
import {a} from 'lib' ===> const {a} = require('lib');
import * as lib from 'lib' ===> const lib = require('lib');
```

现在你可能想起来，我在项目中不是这么用 react 的啊， 项目中直接 `import react from 'react'`; 这一切要归功给 babel.

## babel 处理

我们直接使用 babel online 看看他是怎么处理我们上面 lib.js 的：

```javascript
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = exports.b = exports.a = void 0;
var a = 1;
exports.a = a;
var b = 2;
exports.b = b;
var _default = 3;
exports.default = _default;
```

这里看上去，没什么区别。 只是在 exports 挂了一个 \_\_esModule 属性。 然后我们看 import， 先看最简单的:

```javascript
import { a, b } from 'lib';

console.log(a);
console.log(b);
```

经过 babel 处理后，变成了这样：

```javascript
'use strict';

var _lib = require('lib');

console.log(_lib.a);
console.log(_lib.b);
```

babel 在处理这一块的时候，使用整体导入的。那 default import 呢？

```javascript
'use strict';

var _lib = _interopRequireDefault(require('lib'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

console.log(_lib.default);
```

这有一个关键的点，虽然 babel 还是使用了整体导入的形式，但是包了一层 \_interopRequireDefault, 单独处理 default import 的形式。前面我们也看到了， es module 在转换时会在
export 上挂载\_\_esModule 属性，所有在导入时，如果时 es module 直接返回，如果不是则当 cjs 处理， 把整体模块挂在一个对象的 default 属性上，这样后续的操作就统一了。这也是为什么
你可以在使用了 babel 的项目中可以以`import react from 'react'` 的形式使用。

真是因为 babel 的处理，所以我们才可以自由的使得 cjs 和 esm 的模块相互直接调用。

## rollup

在 rollup 把 esm 转换成 cjs 上， 大部分的操作是一致的，lib.js rollup 会这样处理：

```javascript
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const a = 1;
const b = 2;
var module_2 = 3;

exports.a = a;
exports.b = b;
exports.default = module_2;
```

import 是这样处理的：

```javascript
function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var c = require('lib');
var c__default = _interopDefault(c);

console.log(c.a);
console.log(c.b);
console.log(c__default);
```

这里注意一点， rollup 本身并没有使用 \_\_esModule 的标识来处理 default。

使用 rollup 还要一点需要注意，如果只有一个单独的 default export 的时候， rollup 的处理方式会不同：

```javascript
// esm
export default function add(a, b) {
  console.log(a + b);
}

// rollup 处理成 cjs
function add(a, b) {
  console.log(a + b);
}

module.exports = add;
```

我们看到，rollup 直接把 default export 挂到了 module.exports 上。而 babel 还是通过 \_\_esModule 的标识，挂载在 exports.default 上。这个地方需要特别关注， 假如有一个库之前时
使用 babel 处理的， 那 cjs 用户只能以 `require('lib').default` 的形式来使用。 有一天这个库的作者决定使用 rollup, 那么 cjs 的用户想要使用新的库，只能去更改原先的代码。

## 最后

在我们平常的开发中，可能我们已经习惯了 default export, 特别是在 react 项目中，我们自然的写下 `export default myComponent`。实际上，如果本身只准备支持 es module, default export 绝对是一个
很便利的方式。但是，如果你同时需要支持 cjs 和 esm, 那就要慎重考虑 `default export`。 因为 esm 与 cjs 如何相互使用，并不由你决定，而是由帮你打包处理的工具决定。希望本文对你有所帮助~

## 参考文章

- [深入解析 ES Module（二）：彻底禁用 default export](https://zhuanlan.zhihu.com/p/97335917)
- [Great import schism: Typescript confusion around imports explained](https://itnext.io/great-import-schism-typescript-confusion-around-imports-explained-d512fc6769c2)
- [import \* as React from 'react'; vs import React from 'react';](https://stackoverflow.com/questions/55285737/import-as-react-from-react-vs-import-react-from-react)

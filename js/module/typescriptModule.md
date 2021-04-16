# import 的分裂: 解释 typescript import 的困惑

> 原文地址: [Great import schism: Typescript confusion around imports explained](https://itnext.io/great-import-schism-typescript-confusion-around-imports-explained-d512fc6769c2)

> 参考文章: [深入解析 ES Module（二）：彻底禁用 default export](https://zhuanlan.zhihu.com/p/97335917)

我开始使用 typescript 已经有一段时间了, 说实话在理解他的 modules 和相应配置时候遇到了很多麻烦, 也很让我困惑.
例如 Namespaces, import \* as React from 'react', esModuleInterop.

我并不会谈论关于 Namespaces 的事情, 因为他是 typescript 的模块系统就目前的发展方向而言,Namespaces 并不太好,并且也没有人使用.

那么在 `esModuleInterop`之前,我们使用什么呢? 我们有和 babel 或者 浏览器近乎相同的 modules, 特别是命名上: import/exports. 但是
在 default export 和 import 上 typescript 有自己的处理方式. 我们必须这样导入 react: `import * as React from 'react'` 而不是
`import React from 'react'`. 当然我们不仅仅是讨论 react, 而是关于所有 cjs 模块的导入.

为了弄清楚原因，让我们看看 commonjs 和 es6 模块中某些模式之间的互操作性如何工作. 例如,我们有一个模块导出一个 object, 分别有两个属性 foo 和 bar:

```javascript
module.exports = { foo, bar };
```

我们可以使用 require 和 解构来导入使用:

```javascript
const { foo, bar } = require('my-module');
```

同样的我们可以使用 import 导入使用:

```javascript
import { foo, bar } from 'my-module';
```

但是在 commonjs 中更常见的形式是这种`const myModule = require('my-module')`(因为当时还没有解构). 那么我们如何在 es6 中实现这一点呢?

在开发 es6 导入规范时，重要的问题之一是与 commonjs 的互操作性，因为 commonjs 已经有很多代码。这也是 default imports/exports 出现的原因. 他们的目的是提供与 commonjs 的互操作性，
因此我们可以这样写`import myModule from 'my-module'`, 并得到一些结果. 但是从规范中尚不清晰，此外，互操作性的实现是编译器开发人员的特权. 因此我们在
`import React from 'react' vs import * as React from 'react'` 上产生了分歧.

为什么 typescript 选择了 `import * as React from 'react'`?想象自己是一个编译器开发人员，然后问自己，将 es6 import 转换为 commonjs require 的最简单方法是什么？假设我们有以下一组 export 和 import:

```javascript
export const foo = 1;
export const bar = 2;
export default () => {};

import { foo } from 'module';
import func from 'module';
```

那么,在编译成 commonjs 时让我们使用一个 default key 来作为默认导出:

```javascript
module.exports = {
  foo: 1,
  bar: 2,
  default: () => {}
};
const module = require('module');
const foo = module.foo;
const func = module.default;
```

ok, 看上去很酷, 那么在互操作性上表现如何呢? 如果 default import 意味着是一个 default 字段那么意味着我们写 `import React from 'react'` 等同于 `const { default: React } = require('react')`. 但是这行不通! 让我们改用 \* 导入. 因此用户必须这样写`import \* as React from 'react'`来获得 module.exports 的内容.

但是从 commonjs 的语义上来说会有所不同. Commonjs 只是是普通的 javascript。只是函数和对象. js 规范中也没有 require. 另一方面，ES6 import 现在是规范的一部分，所以在这种情况下，myModule 不仅是普通的 javascript 对象, 而是一个称为名称空间（不是 typescript 名称空间）的东西，因此他具有一定的特性. 其中之一是名称空间不可调用。有人可能会问，这是怎么一回事？

让我们尝试另一个 commonjs 的形式, 我们只 export 一个单独的函数:

```javascript
    module.exports = function() { // do something }
```

我们可以导入并执行它:

```javascript
const foo = require('my-module');
foo();
```

我们尝试在符合规范的环境中使用 es6 模块系统执行相应操作,会得到一个错误:

```javascript
import * as foo from 'my-module';
foo(); // Error
```

因为命名空间与 javascript 对象不同，命名空间包含每个 es6 export 的特定内容。

但是 babel 在处理上提供了一些互操作性使得可以正常运行。因此我们写 `import React from 'react'` 可以正常的工作。它主要是在编译过程中为 es6 的 module 加上一个特殊标记，然后我们
就可以判断如果是 true 那就返回 module.exports. 或者这是 false(很明显，如果库是 commonjs 并且没有被转译), 那就将当前 export 内容包装在 `{default: export}`中，因此我们可以正常
使用 default 。

typescript 使用 \* 来处理，但是最后还是放弃了这种形式，引入了 esModuleInterop 编译器选项。这个选项基本上和 babel 做相同的事情，如果启用它，你就可以 typescript 中使用 `import React from 'react'`。

问题是，尽管默认情况下为新项目启用了该功能（运行 tsc --init 时），但是它不适用于现有项目（即使您更新到 TS 3），因为它不向后兼容。因此你必须重写你的 import \* . react 可以很好的工作，
因为它定义了一堆 export, 但是上面例子中的，带有调用命名空间的就不行。但是不用担心，如果 export 类型正确（并且大多数情况下是正确的，因为它们会自动修复很多错误），TS 3 将为您提供一种快速修复方法，将星号导入转换为默认值.

因此，我非常建议使用`esModuleInterop`选项，不仅可以让你写更少， 更易于阅读的代码还可以规范代码（这不是说说而已， rollup 禁止在这种情况下使用 import \*）. 还减轻了 typescript 和 babel 社区的摩擦。

⚠ 警告：以前有 enableSyntheticDefaultImports 选项，该选项基本上因使编译器错误的处理 default import 而关闭，所以我们必须提供与 commonjs 互操作的方式（例如 WebpackDefaultImportPlugin），
尽管存在很多问题，例如如果您有测试，还需要为测试提供此互操作。需要注意的是，只有当 target <= ES5 时，esModuleInterop 才会自动启用综合默认导入。因此如果你使用这个选项，编辑器还是会提示`import React`. 检查您的 target 并可能启用综合默认导入(或者重新启动 vscode).

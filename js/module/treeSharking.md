## commonjs 和 es module 区别

- commonjs 是服务端模块化 js 规范. 可以把一个文件是一个模块. 模块就是一个对象. export 其实是在 module.exports 上挂载导出属性. commonjs 是运行时加载, 输出的是值的拷贝.
  也就是说模块内部值的改动不会影响到输出值.

- es module 输出的是值的引用, 编译时输出接口。

- commonjs 内部 this 指向模块本身, es module this 指向 undefined

- 对循环引用的处理. commonjs 会先返回当前代码已执行部分. 而 es6 处理循环引用是,认为该模块已加载,会直接使用 import 的值.

## tree sharking

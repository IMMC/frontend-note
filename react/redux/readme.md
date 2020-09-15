# redux

在前端需求日益复杂的情况下，前端需要管理大量的状态。当状态特别多和复杂的时候，我们很难去定位 bug 或者添加型 feature。于是. redux 通过对更新的限制来使得突变是可预测的。

redux 三大基本原理：

1. 单一数据源。 应用的全局状态存储在单个对象中，方便进行管理。
2. state 是只读的，改变 state 的唯一方法是触发一个 action 来描述改变，并改变 state
3. 使用纯函数进行修改。使用纯函数来实现 action 对 state 的修改

## 解析

(middleware)[https://zhuanlan.zhihu.com/p/85306555]

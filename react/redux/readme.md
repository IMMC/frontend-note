# redux

在前端需求日益复杂的情况下，前端需要管理大量的状态。当状态特别多和复杂的时候，我们很难去定位 bug 或者添加型 feature。于是. redux 通过对更新的限制来使得突变是可预测的。

redux 三大基本原理：

1. 单一数据源。 应用的全局状态存储在单个对象中，方便进行管理。
2. state 是只读的，改变 state 的唯一方法是触发一个 action 来描述改变，并改变 state
3. 使用纯函数进行修改。使用纯函数来实现 action 对 state 的修改

## Middleware

redux 的 Middleware 机制，允许我们扩充行为，使得我们在 dispatch 一个 action 到触发 reducer 这个过程中可以插入自定义操作。本质上 redux 的 middleware 机制是对 dispatch 函数的重写。

例如，一个简单的 middleware :

```javascript
function logger(store) {
  return function wrapDispatchToAddLogging(next) {
    return function dispatchAndLog(action) {
      console.log('dispatching', action);
      let result = next(action);
      console.log('next state', store.getState());
      return result;
    };
  };
}
// 箭头函数版
const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};
```

使用 middleware:

```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';

const todoApp = combineReducers(reducers);
const store = createStore(
  todoApp,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(logger, crashReporter)
);
```

我们使用了 applyMiddleware 来挂载这些 middleware, 我们来看看 applyMiddleware 的实现。

### applyMiddleware

applyMiddleware 的代码实现非常简单，简化下：

```javascript
export const applyMiddleware = middlewares => {
  return createStore => (reducer, preloadedState) => {
    // 调用老的 createStore 创建 store
    const store = createStore(reducer, preloadedState);
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      );
    };
    const middlewareAPI = {
      getState: store.getState,
      // 保持对 dispatch 的引用
      dispatch: (action, ...args) => dispatch(action, ...args)
    };
    // 执行每一个middle 传入 store
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    // 生成新的 dispatch 函数
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch
    };
  };
};
```

#### compose 函数

主要看 compose 函数，是如何处理调用链形成新的 dispatch 函数的。

```javascript
const compose = funcs => {
  if (funcs.length === 0) return args => args;
  if (funcs.length === 1) return funcs[0];

  return funcs.reduce(function reducer(acc, curr) {
    return function(...args) {
      return acc(curr(...args));
    };
  });
};
```

这里巧妙的运用了 reduce 方法. 经过 compose 处理后，让 middleware 一层层包裹起来，形成了链式的调用

```javascript
compose([fn2, fn1]);
// 结果类似，这里的 fn2 = next => action => {return next(action)}
const composeResult = (...args) => fn2(fn1(...args));
// 最后生成 dispatch , middle 的执行顺序是从右到左的，最后生成的 dispatch 是fn2 生成的，所以在执行dispatch 时候，会从左到右依次调用
dispatch = composeResult(store.dispatch);
```

## redux-thunk

```javascript
function createThunkMiddleware() {
  //  redux-thunk 那个这里的 dispatch 其实是指向 action => {} 的。
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
export default thunk;
```

## 解析

(middleware)[https://zhuanlan.zhihu.com/p/85306555]

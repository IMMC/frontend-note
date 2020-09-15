# context

react 使用了 context 来支持组件间共享状态。使得在一个组件树内都可以访问使用数据。

使用 React.createContext 创建一个 context. 每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

## 源码实现

### createContext

createContext 较为简单，只是返回了一个 context 对象，里面包含 provider, consumer

简化下代码：

```javascript
const createContext = defaultValue => {
  const context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    Provider: null,
    consumer: null
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };

  context.Consumer = context;

  return;
};
```

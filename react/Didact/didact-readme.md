# didact

## 简介

简单的 react 实现

## jsx

jsx 的语法，是一个语法糖
例如以下内容:

```javascript
<div>
  <h1>test</h1>
</div>
```

经 babel 处理后：

```javascript
createElement('div', null, createElement('h1', null, 'test'));
```

createElement 很简单，仅仅返回 一个 object 来描述 react 元素

```javascript
    {
        type: 'div',
        props: {
            ...props,
            children: [],
        }
    }
```

因此 整个 react 元素树 都被转换成嵌套的对象，交给 render 函数处理。

## virtualDom

render 函数拿到 react 树后，不是简单的就把元素一个个解析出来，然后生成 dom。而是生成一个对应的 virtualDom。
react 在内部为每个元素创建 一个 fiber. fiber 保存了元素的基本信息 和 dom, diff 也是对 fiber 树进行 diff。
每次 render 都需要对前后两次的 fiber 树进行 diff, 得出最优解，再去更新 dom。当然如果直接对两棵树进行遍历 diff 是
非常耗时的，也是不可接受的，于是 react 简化了 diff 过程：

1. 当前节点类型与上次一致，则认为改节点不需要重新创建，只需要 update
2. 当前节点类型与上一次不一致，则认为完成不同，直接删除当前所有子树。
3. 上次同位置不存在元素， 直接创建新的元素

通过这种策略，把 diff 时间复杂度降到了 O(n)

## workLoop

不断循环处理每一个单元的工作，并且是可以被中断的。nextUnitOfWork 为空表示 diff 已完成， 进行 commitRoot

## performUnitOfWork

这个函数主要是对 react 树的遍历。 为当前传入的 节点，所有子元素进行 diff 创建对应的 fiber 节点。
当前 fiber 处理完成后，如果有子节点 就返回子节点成为 nextUnitOfWork. 没有子节点就返回兄弟节点。
直到返回 null, 表示 diff 过程已结束。

## commitRoot

这一步已经拿到 diff 过的结果, 根据 diff 结果 对 dom 进行更新。这一步 不可被中断的，一步完成。

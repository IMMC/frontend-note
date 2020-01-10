/** 全局变量 */
let nextUnitOfWork = null;
// 标识当前正在进行的 root
let wipRoot = null;
// 当前已经完成的 fiber 树， 保存使用方便diff
let currentRoot = null;
// 需要删除的dom
let deletions = null;

let wipFiber = null;
let hookIndex = null;
// 排除 children props
const isEvent = key => key.startsWith('on');
const isProperty = key => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);

function createDom(fiber) {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type);

  Object.keys(fiber.props)
    .filter(item => item !== 'children')
    .forEach(name => {
      dom[name] = fiber.props[name];
    });

  return dom;
}
/**
 *
 * @param {*} fiber currentRoot fiber tree
 * @param {*} elements currentRoot 子元素
 * @description 与旧  fiber tree 进行 diff 决定如何更新, 处理 当前 wipRoot
 */
function reconcileChildren(fiber, elements) {
  let index = 0;
  // 获得旧的 fiber 树的子元素
  let oldFiber = fiber.alternate && fiber.alternate.child;
  let prevSibling = null;
  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];
    let newFiber = null;
    // 相同位置是否类型相同
    const sameType = oldFiber && element && element.type === oldFiber.type;
    // 元素类型没有改变 不需要重新 create
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        // 当前对应的副本，可复用
        alternate: oldFiber,
        effectTag: 'UPDATE'
      };
    }
    // 旧 fiber 中无对应元素。 需要新增
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: fiber,
        alternate: null,
        effectTag: 'PLACEMENT'
      };
    }
    // 相同位置 类型不同 旧dom 需要删除
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }
    // 遍历兄弟元素
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    // 第一个 fiber 为 当前 fiber 直接子元素，剩下为邻居
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  // 保存 state 值
  wipFiber.hooks = [];
  // 函数组件， 运行该函数，得到子元素
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // 添加元素到父节点
  //   if (fiber.parent) {
  //     fiber.parent.dom.appendChild(fiber.dom);
  //   }
  const elements = fiber.props.children;

  // diff过程
  reconcileChildren(fiber, elements);
}
/**
 * @description
 * step1: 为子元素创建 fiber
 * step2： 返回需要处理的 下一个 fiber
 */
function performUnitOfWork(fiber) {
  // 处理 function component
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 返回 nextUnitOfWork 规则： 子元素 --> 兄弟元素 --> 父元素的兄弟元素 --> finish
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  return null;
}

/**
 * hooks
 */

function useState(initial) {
  const oldHook =
    wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };

  // setState 更新后，重新触发 useState，调用 action
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = action(hook.state);
  });

  // 触发更新
  const setState = action => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}
/**
 *
 * @param {*} dom
 * @param {*} prevProps
 * @param {*} nextProps
 * @description 对挂载在 dom 上的 props 更新
 */
function updateDom(dom, prevProps, nextProps) {
  // 单独处理事件监听，移除已发生改变的事件监听
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = '';
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  // 绑定新的事件监听
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

// 删除元素
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}
/**
 *
 * @param {*} fiber
 * @description 批量挂载dom
 */
function commitWork(fiber) {
  if (!fiber) return;
  // 找到包含dom的fiber, 函数组件 根节点可能不包含 dom
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  // 新增dom 操作
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    // 更新操作
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
  }
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
/**
 * @description 所有工作完成后，创建 dom
 */
function commitRoot() {
  // 对需要删除的 dom 批量处理
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}
/**
 *
 * @param {*} deadline requestIdleCallback 回调传入
 * @description 循环把 react 元素添加到 dom 上 利用 requestIdleCallback 避免长时间占用主线程
 *  (note: requestIdleCallback 还处于实验性阶段，这不是 react 内部实现。react 自己实现了 协调器)
 */
function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // diff 完成后批量处理。由此可知， diff 过程是可中断的，但是最后 commit dom 操作是不可中断的 （note: 目前异步挂载dom 已处于实验性阶段）
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
// 浏览器空闲时间调用
requestIdleCallback(workLoop);
/**
 * fiber 保存组件信息的内部对象， react virtual DOM重要实现部分， diff 也是在 fiber 上进行。
 *
 */
function render(element, container) {
  console.log(element);
  // fiber 根节点
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    // 保存上一次 fiber tree 方便 diff
    alternate: currentRoot
  };

  deletions = [];
  nextUnitOfWork = wipRoot;
  console.log(nextUnitOfWork);
}

/**
 *
 * @param {*} text
 * @description 特殊处理 文本类型
 */
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  };
}
/**
 *
 * @param {*} type 类型
 * @param {*} props react 元素 props
 * @param  {...any} children react 子元素
 * @description react jsx 语法 本质上 经过babel 转换后 是调用 createElement, 创建一个描述的 object
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object' ? child : createTextElement(child)
      )
    }
  };
}

const Didact = {
  createElement,
  useState
};

// export default {
//   createElement
// };

/**
 * test, 后期分离
 */
/** @jsx Didact.createElement */
const element = (
  <div>
    <h1>aaaa</h1>
    <span>ba</span>
    <div>
      <p>我是 title</p>
      hahahahahhah
    </div>
  </div>
);

render(element, document.querySelector('#app'));

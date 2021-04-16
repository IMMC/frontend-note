# 树

## 树的遍历

### 前序遍历

> 前序遍历 根节点 -> 左节点 -> 右节点 的顺序。 在代码实现上有两种形式。 第一种采用递归的形式实现, 较为简单。 第二种，非递归的形式，采用 stack 的形式，不断 push 左节点直到最后一个。

递归实现代码:

```javascript
function prevOrder(root, treeArr = []) {
  treeArr.push(root.val);

  if (root.left) prevOrder(root.left, treeArr);
  if (root.right) prevOrder(root.right, treeArr);

  return treeArr;
}
```

非递归代码实现：

```javascript
function prevOrder2(root) {
  const result = [];
  const stack = [];

  while (root || stack.length) {
    while (root) {
      result.push(root.val);
      stack.push(root);
      root = root.left;
    }

    root = stack.pop().right;
  }

  return result;
}
```

### 中序遍历

> 中序遍历 左节点 -> 根节点 -> 右节点。 代码实现依然可以使用 递归 和 stack 非递归的形式实现，和前序遍历类似。

递归代码实现:

```javascript
function inOrder(root, treeArr = []) {
  if (root.left) inOrder(root.left, treeArr);
  treeArr.push(root.val);
  if (root.right) inOrder(root.right, treeArr);

  return treeArr;
}
```

非递归代码实现:

```javascript
function inOrder2(root) {
  const result = [];
  const stack = [];

  while (root || stack.length) {
    while (root) {
      stack.push(root);
      root = root.left;
    }

    root = stack.pop();
    result.push(root.val);
    root = root.right;
  }

  return result;
}
```

### 后序遍历

> 后序遍历 左节点 -> 右节点 -> 根节点。

递归遍历：

```javascript
function postOrder(root, treeArr = []) {
  if (root.left) postOrder(root.left, treeArr);
  if (root.right) postOrder(root.right, treeArr);

  treeArr.push(root.val);

  return treeArr;
}
```

非递归的后序遍历，相对来说要复杂点，需要一个临时变量保存访问过的节点信息：

```javascript
function postOrder2(root) {
  const result = [];
  const stack = [];
  let curr = null;
  let lastNode = null;

  while (root || stack.length) {
    while (root) {
      stack.push(root);
      root = root.left;
    }

    curr = stack[stack.length - 1];

    if (!curr.right || curr.right === lastNode) {
      result.push(curr.val);
      stack.pop();
      lastNode = curr;
      root = null;
    } else {
      root = curr.right;
    }
  }

  return result;
}
```

### 广度优先遍历

使用队列的形式，进行深度优先遍历

```javascript
function BFS(root) {
  const queue = [root];
  const result = [];
  let current = null;

  while (queue.length) {
    current = queue.shift();
    result.push(current.val);
    if (current.left) {
      queue.push(current.left);
    }
    if (current.right) {
      queue.push(current.right);
    }
  }

  return result;
}
```

### 深度优先遍历

实现上，其实前序遍历就是深度优先遍历。

## 寻找子节点路径

> 假设一个二叉树，元素都不重复，给定一个值，求得根节点到这个值的访问路径。

```javascript
function findNodePath(root, target) {
  const stack = [];
  const result = [];
  let currentNode = null;
  let lastNode = null;

  while (root || stack.length) {
    while (root) {
      result.push(root);
      if (root.val === target) {
        return result;
      }
      stack.push(root);
      root = root.left;
    }

    currentNode = stack[stack.length - 1];

    if (!currentNode.right || currentNode.right === lastNode) {
      stack.pop();
      result.pop();
      root = null;
      lastNode = currentNode;
    } else {
      root = currentNode.right;
    }
  }

  return result;
}
```

## leetCode

### 寻找最近公共父元素

```javascript
const lowestCommonAncestor = function(root, p, q) {
  let ans = null;
  function dfs(tRoot, tp, tq) {
    if (!tRoot) return false;
    const isCurrent = tRoot.val === tp.val || tRoot.val === tq.val;
    const isInRight = dfs(root.right, tp, tq);
    const isInLeft = dfs(root.left, tp.tq);

    if ((isInRight && isInLeft) || (isCurrent && (inInLeft || isInRight))) {
      ans = tRoot;
    }

    return isInRight || isInLeft || isCurrent;
  }

  return ans;
};
```

### 寻找二叉搜索树的最近公共父元素

leetCode 235 题 [二叉搜索树的最近公共祖先](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

> 利用二叉搜索树的特性，当出现分叉时，即一个节点处于中间时，这个节点就是答案。

```javascript
var lowestCommonAncestor = function(root, p, q) {
  while (root) {
    if (Math.max(p.val, q.val) < root.val) {
      root = root.left;
      continue;
    }

    if (Math.min(p.val, q.val) > root.val) {
      root = root.right;
      continue;
    }

    return root;
  }

  return root;
};
```

### 二叉树层级遍历

题目[层级遍历](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

> 广度优先遍历的形式。一层一层处理

```javascript
var levelOrder = function(root) {
  if (!root) return [];
  let queue = [root];
  const result = [];
  let tempArr = [];
  let tempResult = [];
  let current = null;

  while (queue.length) {
    while (queue.length) {
      current = queue.shift();
      tempResult.push(current.val);
      if (current.left) {
        tempArr.push(current.left);
      }

      if (current.right) {
        tempArr.push(current.right);
      }
    }

    result.push(tempResult);
    queue = tempArr;
    tempArr = [];
    tempResult = [];
  }

  return result;
};
```

> 深度优先遍历形式

```javascript
var levelOrder = function(root) {
  let stack = [];
  const result = [];
  let current;
  let i = 0;
  while (root || stack.length) {
    while (root) {
      if (!result[i]) {
        result[i] = [];
      }
      result[i].push(root.val);
      stack.push({ node: root, level: i });
      root = root.left;
      if (root) i++;
    }

    current = stack.pop();
    root = current.node.right;
    if (root) {
      i++;
    } else {
      i = stack.length > 0 ? stack[stack.length - 1].level : 0;
    }
  }

  return result;
};
```

### 二叉树最大深度

leetCode 题目[最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

> 1. 第一种，使用递归的形式，求得左右子树的最大深度，取最大值，以此递归直到结束

```javascript
var maxDepth(root) {
  if (!root) return 0;

  return 1 + Math.max(MaxDepth(root.left), MaxDepth(root.right));
}
```

> 2. 使用 BFS 的形式，按层遍历取最大值

```javascript
var maxDepth = function(root) {
  if (!root) return 0;
  let queue = [root];
  let result = 0;
  let tempQueue = [];
  let current = null;

  while (queue.length) {
    result++;
    while (queue.length) {
      current = queue.pop();
      if (current.left) {
        tempQueue.push(current.left);
      }

      if (current.right) {
        tempQueue.push(current.right);
      }
    }

    queue = tempQueue;
    tempQueue = [];
  }

  return result;
};
```

### 前序 后序遍历，还原二叉树

```javascript
const reBuildTree = (arr1, arr2) => {
  if (arr1.length === 0) return null;
  const root = arr1[0];
  const splitIndex = arr2.findIndex(item => item === arr1[1]);
  root.left = reBuildTree(arr1.slice(1, splitIndex + 2), arr2.slice(0, splitIndex + 1));
  root.right = reBuildTree(arr1.slice(splitIndex + 2), arr2.slice(splitIndex + 1));

  return root;
};
```

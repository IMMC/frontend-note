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
  const pPath = findNodePath(root, p);
  const qPath = findNodePath(root, q);

  let publicNodeVal = 0;

  let i = 0;
  let j = 0;
  while (i < pPath.length && j < qPath.length) {
    if (pPath[i].val !== qPath[j].val) break;
    publicNodeVal = i;
    i++;
    j++;
  }

  return pPath[publicNodeVal];
};
```

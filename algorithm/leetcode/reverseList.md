# 反转链表

leetcode 第 206 题。

### 解题思路 1

> 迭代处理，使用 tempNode 保存下一个节点，lastNode 保存上一个节点。 遍历链表处理

```javascript
var reverseList = function(head) {
  if (!head || head.next === null) return head;
  let lastNode = null;
  let tempNode = null;
  let currentNode = head;

  while (currentNode) {
    tempNode = currentNode.next;
    currentNode.next = lastNode;
    lastNode = currentNode;
    currentNode = tempNode;
  }

  return lastNode;
};
```

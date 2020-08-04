# 链表

## 反转链表

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

## 链表相加 II

leetcode 445 题。 两个链表数字相当于逆序的，第一位是数字最高位。在不反转原链表情况下，得出相加结果

### 解题思路 1

1. 两个链表长度可能不一致，第一步，遍历补全链表。使得长度一致
2. 把补齐的链表按位相加，不做进位处理，同时按逆序的方式输出结果链表。也就是 当前计算的得到的 node 的 next 指向上一个计算得到的 node
3. 遍历第二步得到的链表，如果 node 的 val 大于 10 就进一位。同时，输出方式和第二步一样 逆序输出。最后的结果就是答案。

```javascript
var addTwoNumbers = function(l1, l2) {
  let l1Head = l1;
  let l2Head = l2;
  let p1 = new ListNode();
  p1.next = l1;
  let p2 = new ListNode();
  p2.next = l2;
  let tempNode = null;
  // 补全两个链表
  while (l1Head || l2Head) {
    if (!l1Head) {
      // 补全 l1 链表
      tempNode = new ListNode(0);
      tempNode.next = p1.next;
      p1.next = tempNode;
      l2Head = l2Head.next;
      continue;
    }
    if (!l2Head) {
      // 补全 l2 链表
      tempNode = new ListNode(0);
      tempNode.next = p2.next;
      p2.next = tempNode;
      l1Head = l1Head.next;
      continue;
    }

    l1Head = l1Head.next;
    l2Head = l2Head.next;
  }

  let lastNode = null;
  let sumNode = null;

  p1 = p1.next;
  p2 = p2.next;
  // 计算结果反向链表
  while (p1) {
    sumNode = new ListNode(p1.val + p2.val);
    sumNode.next = lastNode;
    lastNode = sumNode;
    p1 = p1.next;
    p2 = p2.next;
  }
  // 再次反转得到答案
  let sumList = lastNode;
  let addNum = 0;
  lastNode = null;
  sumNode = null;
  while (sumList) {
    sumNode = new ListNode((sumList.val + addNum) % 10);
    addNum = sumList.val + addNum > 9 ? 1 : 0;
    sumNode.next = lastNode;
    lastNode = sumNode;
    sumList = sumList.next;
  }

  if (addNum) {
    tempNode = new ListNode(1);
    tempNode.next = lastNode;
    lastNode = tempNode;
  }

  return lastNode;
};
```

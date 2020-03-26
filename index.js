function ListNode(val) {
  this.val = val;
  this.next = null;
}

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

const head1 = {
  val: 5,
  next: null
};

const head2 = {
  val: 5,
  next: null
};

console.log(addTwoNumbers(head1, head2));

# 腾讯算法部分

## 第三题无重复最长子字符串

### 题解

> 使用 set 的数据结构来解决。第一层循环 i，i 每移动一次，就表示第 i - 1 到 right 的区间内已经存在重复了，需要从 set 中删除。第二层循环不停向后移动，向 set 中添加字符，如果遇到 set 中已存在的字符，就需要跳出循环。删除字符直到不再重复。

```javascript
const lengthOfLongestSubstring = function(s) {
  const subStr = new Set();
  let right = 0;
  let maxLength = 0;
  for (let i = 0; i < s.length; i++) {
    if (i > 0) {
      subStr.delete(s[i - 1]);
    }

    while (right < s.length && !subStr.has(s[right])) {
      subStr.add(s[right]);
      right++;
    }

    maxLength = Math.max(subStr.size, maxLength);
  }

  return maxLength;
};
```

## 最长公共前缀

题目： [最长公共前缀](https://leetcode-cn.com/problems/longest-common-prefix/)

> 横向进行比对，找最长公共前缀

```javascript
var longestCommonPrefix = function(strs) {
  if (strs.length < 1) return '';
  let prefix = '';

  for (let i = 0; i < strs[0].length; i++) {
    for (let j = 0; j < strs.length; j++) {
      if (!strs[j][i] || strs[j][i] !== strs[0][i]) return prefix;
    }
    prefix += strs[0][i];
  }

  return prefix;
};
```

## pow

题目: [实现 pow(x, n) ，即计算 x 的 n 次幂函数](https://leetcode-cn.com/problems/powx-n/)

> 采用分治法求解。

```javascript
var myPow = function(x, n) {
  if (n === 0) return 1;
  if (n < 0) return 1 / myPow(x, -n);
  if (n % 2) return x * myPow(x, n - 1);
  return myPow(x * x, n / 2);
};
```

## 三数之和

题目： 给一个数组，求的所有三个数相加为 0 的组合。[三数之和](https://leetcode-cn.com/problems/3sum/)

> 求所有集合，避免不了对所有结果的三层遍历。但是可以对这三层遍历进行优化以达到加速的功能。 先对数组进行排序，然后第一层遍历，假设下标为 a。 那么剩下两层遍历就是求两数之和为 -nums[a] 的值。 然后可以把第二层和第三层遍历一次完成。使用双指针。第二层起始位置为 b = a + 1, 第三层起始位置 c 为 nums.length - 1, 那里面两层遍历可以看做是 b 和 c 逼近求得-nums[a]。

```javascript
var threeSum = function(nums) {
  const result = [];
  nums = nums.sort((v1, v2) => v1 - v2);

  for (let i = 0; i < nums.length; i++) {
    // 在i之前，已经匹配过的，不需要再匹配
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    const target = -nums[i];
    let c = nums.length - 1;
    for (let j = i + 1; j < nums.length; j++) {
      if (j > i + 1 && nums[j] === nums[i]) {
        continue;
      }

      // 从最后一位往前找，直到找到等于或小于目标值的组合
      while (j < c && nums[j] + nums[c] > target) {
        c--;
      }

      // 两个位置重叠，由于是递增数列，没必要继续循环直接退出
      if (j === c) {
        break;
      }

      if (nums[j] + nums[c] === target) {
        result.push([nums[i], nums[j], nums[c]]);
      }
    }
  }

  return result;
};
```

## 求未排序数组中第 k 大的值

基于快排的快速选择，得出结果

```javascript
const swap = (arr, left, right) => {
  const temp = arr[left];
  arr[left] = arr[right];
  arr[right] = temp;
};

const partition = (arr, left, right) => {
  const point = arr[right];
  let changeP = left;

  for (let i = left; i < arr.length; i++) {
    if (arr[i] < point) {
      swap(arr, changeP, i);
      changeP++;
    }
  }

  swap(arr, right, changeP);
  return changeP;
};

const quickSelect = (arr, k, left, right) => {
  const p = partition(arr, left, right);
  if (p === k) {
    return arr[p];
  }
  return p > k ? quickSelect(arr, k, left, p - 1) : quickSelect(arr, k, p + 1, right);
};
```

## 二叉树的公共祖先

可以采用 dfs 的形式寻找公共祖先。一个满足条件的公共祖先要符合以下条件： 两个值分别在左子树和右子树。

```javascript
var lowestCommonAncestor = function(root, p, q) {
  var ans;

  var dfs = (tRoot, pNode, qNode) => {
    if (!tRoot) return false;
    const isCurrent = tRoot.val === pNode.val || tRoot.val === qNode.val;
    // 左子树是否包含目标值
    const isLeft = dfs(tRoot.left, pNode, qNode);
    const isRight = dfs(tRoot.right, pNode, qNode);

    if ((isRight && isLeft) || (isCurrent && (isLeft || isRight))) {
      ans = tRoot;
    }
    // 返回的结果是，子树是否包含了目标值
    return isLeft || isRight || isCurrent;
  };
  dfs(root, p, q);
  return ans;
};
```

## 搜索二叉树的公共子元素

```javascript
var lowestCommonAncestor = function(root, p, q) {
  while (root) {
    // 最大值都比root 的值小，那结果一定在root 的左子树上
    if (Math.max(p.val, q.val) < root.val) {
      root = root.left;
      // 最小值都比 root 值大，那结果一定在 root 的右子树上
    } else if (Math.min(p.val, q.val) > root.val) {
      root = root.right;
    } else {
      return root;
    }
  }
};
```

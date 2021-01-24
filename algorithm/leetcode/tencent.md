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

## 不同路径

一个机器人在一个 mxn 的网格中，机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角。 共有多少种解法。

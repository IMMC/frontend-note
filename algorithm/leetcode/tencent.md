# 腾讯算法部分

## 第三题无重复最长子字符串

### 题解

> 使用双指针滑动窗口的形式，left = 0; right = 1; 使用一个 map 保持访问过的数据. key 是字符串的值，value 是 index。 移动 right, 如果在 map 没有找到对应的值，就把继续移动。如果找到对应的 value, 并且这个 value 小于 left, 则更新 left 为 value + 1。 每次循环更新 right -value 的值，取最大值就是结果。

```javascript
var lengthOfLongestSubstring = function(s) {
  if (s.length < 2) return s.length;
  let result = s[0];
  let maxLength = 0;
  let left = 0;
  let right = 1;
  const sMap = {};
  sMap[s[0]] = 0;

  while (right < s.length) {
    if (sMap[s[right]] !== undefined && sMap[s[right]] >= left) {
      left = sMap[s[right]] + 1;
      result = s.slice(left, right + 1);
    } else {
      result += s[right];
    }
    sMap[s[right]] = right;
    right++;
    maxLength = result.length > maxLength ? result.length : maxLength;
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
        result.push([num[i], nums[j], nums[c]]);
      }
    }
  }

  return result;
};
```

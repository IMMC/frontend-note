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

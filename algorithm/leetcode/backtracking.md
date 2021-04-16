# 回溯算法

## 电话号码组合

leetcode 原题: [电话号码组合](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)

键盘上每一个数字对应一组英文字符，输入数字求所有的字母组合方式。

我们可以采用 dfs 回溯的形式来解决问题，先深度优先遍历到结尾，存入结果，然后回溯到上一步还未使用的字母继续 bfs, 遍历结束后，得到结果。

```javascript
var letterCombinations = function(digits) {
  if (!digits) return [];
  const numStrMap = [
    null,
    null,
    ['a', 'b', 'c'],
    ['d', 'e', 'f'],
    ['g', 'h', 'i'],
    ['j', 'k', 'l'],
    ['m', 'n', 'o'],
    ['p', 'q', 'r', 's'],
    ['t', 'u', 'v'],
    ['w', 'x', 'y', 'z']
  ];
  const digitsArr = digits.split('').map(item => numStrMap[+item]);
  const result = [];

  const dfs = (currI, tempArr) => {
    if (tempArr.length === digitsArr.length) {
      result.push(tempArr.join(','));
    }
    if (currI === digitsArr.length) return;

    for (let i = 0; i < digitsArr[currI].length; i++) {
      dfs(currI + 1, [...tempArr, digitsArr[currI][i]]);
    }
  };

  dfs(0, []);

  return result;
};
```

## 单词搜索

leetcode 原题： [单词搜索](https://leetcode-cn.com/problems/word-search/)

给定一个二维网格和一个单词，找出该单词是否存在于网格中。单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

使用回溯算法来处理，从网格的第一位出发，沿着上下左右四个方向依次搜索， 假如先从左边开始搜索，如果某一步不匹配，那么这条路径就不需要继续搜索了，回退到上一步，选择另外一个方向继续搜索。以此类推，直到遍历所有结果或者找到目标单词。

```javascript
var exist = function(board, word) {
  const x = board.length;
  const y = board[0].length;

  const visitCache = new Array(x);
  const direction = [
    [0, 1],
    [0, -1],
    [-1, 0],
    [1, 0]
  ];
  for (let i = 0; i < visitCache.length; i++) {
    visitCache[i] = new Array(y).fill(false);
  }

  // bfs 遍历
  const bfs = (i, j, k) => {
    if (board[i][j] !== word[k]) {
      return false;
    } else if (k === word.length - 1) {
      return true;
    }
    visitCache[i][j] = true;
    let target = false;

    for (d of direction) {
      const [nextI, nextJ] = d;
      const newI = i + nextI;
      const newJ = j + nextJ;

      if (i > -1 && newI < x && j > -1 && newJ < y) {
        if (!visitCache[newI][newJ]) {
          target = bfs(newI, newJ, k + 1);

          if (target) break;
        }
      }
    }
    visitCache[i][j] = false;

    return target;
  };

  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      if (check(i, j, 0)) {
        return true;
      }
    }
  }

  return false;
};
```

## 全排列

给定一个 没有重复 数字的序列，返回其所有可能的全排列。

```javascript
var permute = function(nums) {
  const result = [];
  // visitMap 记录访问过的数字
  const dfs = (visitMap, tempArr) => {
    if (tempArr.length === nums.length) {
      result.push(tempArr);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (!visitMap[nums[i]]) {
        // 这里注意， 解构传入全新的 object 和 array , 避免影响全局
        dfs({ ...visitMap, [nums[i]]: true }, [...tempArr, nums[i]]);
      }
    }
  };

  for (let i = 0; i < nums.length; i++) {
    bfs({ [nums[i]]: true }, [nums[i]]);
  }

  return result;
};
```

## 括号生成

给定一个数字，生成所有的括号组合

```javascript
var dfs = (left, right, n, str = '', result = []) => {
  if(right === left) {
    if(left === n) {
      result.push(str);
      return result;
    }
  }

  left < n && dfs(left + 1, right, n, str + '(', result);
  (right < n && right < left) dfs(left, right + 1, n , str + ')', result);

  return result;
}
var gen = function(n) {
  return dfs(0,0, n);
}
```

## 有效的 ip 地址

给定一串数字，输出所有有效的 ip 地址。每一位符合 大于等于 0 并且小于等于 255

```javascript
var dfs = (str, start, pid, ipArr, result) => {
  if (pid === 4) {
    if (start === str.length) {
      result.push(ipArr.join('.'));
    }
    return;
  }

  if (start === str.length) return;

  if (str[start] === '0') {
    ipArr[pid] = 0;
    dfs(str, start + 1, pid + 1, ipArr, result);
    return;
  }

  for (let i = start + 1; i < str.length + 1; i++) {
    let curr = str.slice(start, i);
    if (curr > 0 && curr < 256) {
      ipArr[pid] = curr;
      dfs(str, i, pid + 1, ipArr, result);
    } else {
      break;
    }
  }
};
```

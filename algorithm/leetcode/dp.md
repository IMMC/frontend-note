# dp 动态规划

动态规划四个准则：

1. 递归 + 记忆化 => 递推
2. 状态的定义; opt[n], dp[n],
3. 状态转移方程 opt[n] = best_of(opt[n - 1], opt[n - 2])
4. 最优子结构

## 纸币最优组合

假设一个国家有 1 元 5 元 11 元 三种纸币。给出一个金额 n, 求出组合出金额 n 的最优纸币数量

我们定义 f(n) 为当前最优解，不难发现 f(n) = min(f(n - 1), f(n - 5), f(n - 1)) + 1; 这个就是状态转移方程。我们自底向上推导这个过程。

```javascript
const bastCont = n => {
  const dp = [];
  dp[0] = 0;

  for (let i = 1; i < n + 1; i++) {
    if (i < 5) {
      dp[i] = i;
    } else if (i < 12) {
      dp[i] = Math.min(dp[i - 1], dp[i - 5]) + 1;
    } else {
      dp[i] = Math.min(dp[i - 1], dp[i - 5], dp[i - 11]) + 1;
    }
  }

  return dp[n];
};
```

## 爬楼梯问题

LeetCode 原题，[爬楼梯](https://leetcode-cn.com/problems/climbing-stairs/)

每次可以爬一步或者两步，请问 n 层楼梯有几种方式到达。 这个问题可以用动态规划来解决。 因为可以由最优子结构得到最优结果， 我们假设爬到 n 层的组合方式总是为 f(n). 由于每次只能爬一步或者两步， 那么我们可以知道 f(n) = f(n - 1) + f(n - 2). 这就是这个问题的状态转移方程，它很熟悉，这就是菲波那切数列数列的转移方程。

```javascript
var climbStairs = function(n) {
  const dp = [0, 1, 2];
  for (let i = 3; i < n + 1; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
};
```

## 三角形最小路径和

leetCode 120 题， [三角形最小路径和](https://leetcode-cn.com/problems/triangle/)

给定一个三角形，找出自顶向下的最小路径和。每一步只能移动到下一行中相邻的结点上。相邻的结点 在这里指的是 下标 与 上一层结点下标 相同或者等于 上一层结点下标 + 1 的两个结点。 三角形如下:

```javascript
var triangle = [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]];
```

这题我们可以用动态规划来解决。我们把这个二维数组一行的下标用 row 表示，列的下标用 col 表示。用 f(x, y) 表示一个到当前这个元素的最小路径和，我们可以总结出递推公式： f(col, row) = min(f(col - 1, row), f(col -1, row)) + triangle[col][row]; 那么我们只要求得一列中所有 f(x, y)的值，那么最小值就是题目的结果。

```javascript
const minimumTotal = triangle => {
  const dp = [[triangle[0][0]]];
  const result = dp[0][0];

  for (let i = 1; i < triangle.length; i++) {
    dp[i] = [];
    dp[i][0] = triangle[i - 1][0];
    for (var j = 1; j < triangle.length - 1; j++) {
      dp[i][j] = Math.min(d[i - 1][j], de[i - 1][j - 1]) + triangle[i][j];
    }

    result = Math.min.apply(null, dp[i]);
  }

  return result;
};
```

## 乘积最大连续子数组

LeetCode 152 题 [乘积最大连续数组](https://leetcode-cn.com/problems/maximum-product-subarray/)

这题需要注意的是定义状态和状态转移方程。由于存在负数，所以我们在定义状态时不能仅仅保存最大值，同时需要保存最小值的。我们状态转移方程可以这样定义: f(n) = max(f(n - 1)max*nums[n], f(n-1)min*nums[n], nums[n]);

```javascript
var maxProduct = nums => {
  const dp = [[nums[0], nums[0]], []];
  let res = nums[0];

  for (let i = 1; i < nums.length; i++) {
    let x = i % 2;
    let y = (i - 1) % 2;

    dp[x][0] = Math.max(dp[y][0] * nums[i], dp[y][1] * nums[i], nums[i]);
    dp[x][1] = Math.min(dp[y][0] * nums[i], dp[y][1] * nums[i], nums[i]);

    res = Math.max(res, dp[x][0]);
  }

  return res;
};
```

## 最长上升子序列

leetcode 300 题 [最长上升子序列](https://leetcode-cn.com/problems/longest-increasing-subsequence/)

最大上升子序列，采用动态规划的来进行分析处理这个问题。定义状态 dp, 以及定义状态的转移方程。我们可以定义每一个位置包含该元素的最长上升子序列为 dp[i]。 那么这个状态转移方程就是
dp[i] = max(dp[j] && nums[j] < nums[i]) + 1; 最后的结果就是 max(dp);

```javascript
var lengthOfLIS = function(nums) {
  const dp = [0];
  let target = 0;

  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] > target) {
        target = dp[j];
      }
    }

    dp[i] = target + 1;
    target = 0;
  }

  return Math.max(null, dp);
};
```

## 编辑距离

leetcode 72 题 编辑距离。[编辑距离](https://leetcode-cn.com/problems/edit-distance/)

首先定义状态数组 dp, 这里需要定义一个二维数组。 dp[i][j] 表示 word1 到第 i 位转变为 word2 第 j 为的最短编辑距离。

然后再定义状态转移方程。首先在比较每一位是，存在两种情况： 相等或不等。 在相等条件下，我们不需要进行任何操作。那么我们的 dp[i][j] 就等于 dp[i - 1][j - 1]。 然后考虑不等的情况。 不等时，
我们可以进行 插入， 删除， 替换 三种操作。 那么可以得出 dp[i][j] = min(insert, delete, replace) + 1。 关键是把这三个操作和状态对应起来。第一个插入操作： 插入操作可以看做是 i - 1 到 j 的
最短编辑距离，那么 insert = dp[i - 1][j]。 删除操作： 删除操作可以看做是 i 到 j - 1 的最短编辑距离， 然后到 i 时 执行一个删除操作就是 dp[i][j] 的值了。 delete = dp[i][j - 1] . 替换操作就是由
dp[i - 1][j - 1] 加 1 得到结果。

```javascript
var minDistance = function(word1, word2) {
  const dp = [];
  for (let i = 0; i < word1.length + 1; i++) {
    dp[i] = [];
    dp[i][0] = i;
  }
  for (let j = 0; j < word2.length + 1; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i < word1.length + 1; i++) {
    for (let j = 1; j < word2.length + 1; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min.apply(null, [dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]]) + 1;
      }
    }
  }

  return dp[word1.length][word2.length];
};
```

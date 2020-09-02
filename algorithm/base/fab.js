/**
 * 斐波那契数列
 * 递推公式 f(n) = f(n - 1) + f(n -2);
 */

// 第一种 直接递归
const fn1 = n => {
  return n < 2 ? n : fn1(n - 1) + fn1(n - 2);
};

// 加上记忆化，保存结果避免重复计算
const memoFn = (n, memo = []) => {
  if (n < 2) return n;
  if (memo[n]) return memo[n];

  memo[n] = memoFn(n - 1, memo) + memoFn(n - 2, memo);
  return memo[n];
};

// 使用递推
const fn2 = n => {
  const f = [];
  f[0] = 0;
  f[1] = 1;
  for (let i = 2; i < n + 1; i++) {
    f[i] = f[i - 1] + f[i - 2];
  }

  return f.pop();
};

console.log(fn1(8));
console.log(memoFn(8));
console.log(fn2(8));

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

console.log(bastCont(15));

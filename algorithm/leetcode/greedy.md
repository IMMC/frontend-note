# 贪心算法

## 股票买卖问题

原题： [122. 买卖股票的最佳时机 II](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)

> 在当前条件下 采用贪心算法， 只有后一天比前一天高就买入.

```javascript
var maxProfit = function(prices) {
  if (prices.length < 2) return 0;
  let profit = 0;
  let left = 0;
  let right = 1;

  while (right < prices.length) {
    if (prices[right] - prices[left] > 0) {
      profit = profit + (prices[right] - prices[left]);
      left = right;
      right++;
    } else {
      left++;
      right++;
    }
  }

  return profit;
};
```

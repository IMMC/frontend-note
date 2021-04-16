## 二维数组查找

采用左下角标记法。 以左下角为起点， 如果当前值大于左下角的值就右移一位。如果小于左下角的值就上移一位.

```javascript
var findNumberIn2DArray = function(matrix, target) {
  if (matrix.length === 0 || matrix[0].length === 0) return false;
  let row = 0;
  let column = matrix.length - 1;

  while (row < matrix[0].length && column > -1) {
    if (target === matrix[column][row]) return true;

    if (target > matrix[column][row]) {
      row++;
    } else {
      column--;
    }
  }

  return false;
};
```

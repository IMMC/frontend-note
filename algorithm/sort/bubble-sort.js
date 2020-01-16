function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      const temp = arr[j];

      if (temp > arr[j + 1]) {
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

/**
 * @param {*} arr
 * 优化冒泡排序
 */
function bubbleSort2(arr) {
  // 记录上次交换位置
  let lastExchangeIdx = arr.length - 1;
  // 边界长度
  let borderLength = arr.length - 1;
  for (let i = 0; i < arr.length - 1; i++) {
    let isSort = false;
    for (let j = 0; j < borderLength; j++) {
      const temp = arr[j];

      if (temp > arr[j + 1]) {
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        isSort = false;
        lastExchangeIdx = j;
      }
    }

    // 更改为最后一次交换的位置，该位置之后都是有序的，无需进行遍历
    borderLength = lastExchangeIdx;

    if (isSort) {
      break;
    }
  }
  return arr;
}
/**
 * 鸡尾酒排序
 * @param {*} arr
 * 先正向进行排序，结束后逆向进行排序
 */
function cocktailSort(arr) {
  let lastRightSortIdx = arr.length - 1;
  let lastLeftSortIdx = 0;
  let rightSortLength = arr.length - 1;
  let leftSortLength = 0;

  for (let i = 0; i < arr.length / 2; i++) {
    let isSort = true;

    for (let j = lastLeftSortIdx; j < rightSortLength; j++) {
      const temp = arr[j];

      if (temp > arr[j + 1]) {
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        lastRightSortIdx = j;

        isSort = false;
      }
    }

    if (isSort) {
      break;
    }

    rightSortLength = lastRightSortIdx;

    isSort = true;

    for (let j = lastRightSortIdx; j > leftSortLength; j--) {
      const temp = arr[j];
      if (arr[j] < arr[j - 1]) {
        arr[j] = arr[j - 1];
        arr[j - 1] = temp;
        lastLeftSortIdx = j - 1;

        isSort = false;
      }
    }

    if (isSort) {
      break;
    }

    leftSortLength = lastLeftSortIdx;
  }

  return arr;
}

// test code
console.log(bubbleSort([8, 6, 38, 0, 10]));
console.log(bubbleSort2([8, 6, 38, 0, 10]));
console.log(cocktailSort([8, 6, 38, 0, 9, -8, 29, 10, 90]));
/**
 *  快速排序 以一个元素为基准值，然后 遍历把比该元素小的都放在右边，大的在左边，再对两边的子数字递归处理。
 *  快速排序的平均时间复杂度为 O(nlogn) 最坏情况下 会达到 o(n^2)
 * @param {*} arr
 */
export default function quickSort(arr) {
  if (arr.length < 2) return arr;

  const mid = parseInt((arr.length - 1) / 2, 10);

  const minArr = [];
  const maxArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < arr[mid]) {
      minArr.push(arr[i]);
    } else if (i !== mid) {
      maxArr.push(arr[i]);
    }
  }

  return [].concat(quickSort(minArr), arr[mid], quickSort(maxArr));
}

// 交换元素
function swap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// 找出划分的位置
function partition(arr, left, right) {
  const point = arr[right];

  let i = left;
  let changeP = left;

  while (i < right) {
    if (arr[i] < point) {
      swap(arr, changeP, i);
      changeP++;
    }
    i++;
  }

  swap(arr, changeP, right);
  return changeP;
}

// 原地排序
export function inPlaceQuickSort(arr, l, r) {
  if (l >= r) return arr;
  const p = partition(arr, l, r);

  inPlaceQuickSort(arr, l, p - 1);
  inPlaceQuickSort(arr, p + 1, r);

  return arr;
}

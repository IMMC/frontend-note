/**
 * 选择排序
 * 在未排序的序列中寻找最小的值，放在起始位置。此时起始位置是有序的，对后面未排序序列重复此步骤，直到有序。
 */
export default function selectionSort(arr) {
  let minIdx = 0;
  let temp = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // 交换位置
    if (minIdx !== i) {
      temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }

  return arr;
}

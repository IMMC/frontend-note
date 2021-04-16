/**
 * 归并排序
 * 采用分治法进行处理
 */
function merge(leftArr, rightArr) {
  let sortArr = [];

  let i = 0;
  let j = 0;

  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] < rightArr[j]) {
      sortArr.push(leftArr[i]);
      i++;
    } else {
      sortArr.push(rightArr[j]);
      j++;
    }
  }

  if (i < leftArr.length) {
    sortArr = sortArr.concat(leftArr.slice(i));
  } else if (j < rightArr.length) {
    sortArr = sortArr.concat(rightArr.slice(i));
  }

  return sortArr;
}

export default function mergeSort(arr) {
  if (arr.length < 2) return arr;

  const middleIdx = Math.floor(arr.length / 2);

  return merge(mergeSort(arr.slice(0, middleIdx)), mergeSort(arr.slice(middleIdx)));
}

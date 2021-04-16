/**
 * 插入排序
 * 把第一个元素当作有序列表，第二个开始当作无序列表。从第二个开始，向前扫描，找到合适的插入有序列表的位置。重复步骤，直到列表有序
 */
export default function insertSort(arr) {
  const result = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    for (let j = i - 1; j > -1; j--) {
      if (arr[i] >= result[j]) {
        result.splice(j + 1, 0, arr[i]);
        break;
      }

      if (j === 0) result.unshift(arr[i]);
    }
  }

  return result;
}

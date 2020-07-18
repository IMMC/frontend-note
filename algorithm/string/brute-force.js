// 字符串匹配暴力破解法
export default function bruteForce(str, subStr) {
  const matchInfo = {
    isMatch: false,
    index: -1
  };
  for (let i = 0; i <= str.length - subStr.length; i++) {
    let flag = false;
    for (let j = 0; j < subStr.length; j++) {
      if (str[i + j] !== subStr[j]) {
        flag = false;
        break;
      }

      flag = true;
    }

    if (flag) {
      matchInfo.isMatch = true;
      matchInfo.index = i;
      break;
    }
  }

  return matchInfo;
}

console.log(bruteForce('abc', 'ab'));
console.log(bruteForce('abc', 'bc'));
console.log(bruteForce('ababababcd', 'ababc'));
console.log(bruteForce('ababababcd', 'ababxc'));

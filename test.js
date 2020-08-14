var maxSubArray = function(nums) {
  if (nums.length === 1) return nums[0];
  let maxValue = -Infinity;
  let addValue = nums[0];

  let i = 1;

  while (i < nums.length) {
    while (addValue + nums[i] > addValue) {
      addValue += nums[i];
      i++;
    }
    console.log('finish i:', i);
    console.log('addValue:', addValue);
    console.log('maxValue: ', maxValue);

    if (addValue > maxValue) {
      maxValue = addValue;
    }

    addValue = nums[i];
    i++;
  }

  return maxValue;
};

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));

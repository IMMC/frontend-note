// 深拷贝
const deepClone = (target, map = new Map()) => {
  if (typeof target === 'object') {
    if (!target) return target;
    if (map.get(target)) {
      return map.get(target);
    }
    let cloneTarget;

    if (Array.isArray(target)) {
      cloneTarget = [];
    } else {
      cloneTarget = {};
    }

    map.set(cloneTarget, cloneTarget);

    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        cloneTarget[key] = deepClone(target[key]);
      }
    }

    return cloneTarget;
  }

  return target;
};

// apply 函数
Function.prototype.myApply = function(context, arr) {
  const _context = context || window;

  _context.fn = this;
  let res;

  if (arr) {
    res = _context.fn(...arr);
  } else {
    res = _context.fn();
  }

  delete _context.fn;

  return res;
};

// bind
Function.prototype.myBind = function(context, ...args) {
  const _context = context || window;
  const fn = this;

  return resArg => fn.apply(_context, args.concat[resArg]);
};

// debounce 防抖，函数。定义： 两次事件触发的时间大于指定时间才生效
const debounce = (fn, time) => {
  let timer = null;

  return function(...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, ...args);
    }, time);
  };
};

// throttle

const throttle = (fn, wait) => {
  let timer = null;
  let prev = null;

  return function() {
    var now = Date.now();

    if (!prev) prev = now;

    if (now - prev > wait) {
      fn.apply(this);
      prev = now;
    } else {
    }
  };
};

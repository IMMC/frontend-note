function myPromise(fn) {
  this.status = 'pending';
  this.data = undefined;
  this.onFulfilledCallback = [];
  this.onRejectedCallback = [];
  const self = this;

  function resolve(value) {
    if (self.status === 'pending') {
      self.data = value;
      self.status = 'resolved';
      for (let i = 0; i < self.onFulfilledCallback.length; i++) {
        self.onFulfilledCallback[i](value);
      }
    }
  }

  function reject(reason) {
    if (self.status === 'pending') {
      self.data = reason;
      self.status = 'reject';
      for (let i = 0; i < self.onRejectedCallback.length; i++) {
        self.onRejectedCallback[i](reason);
      }
    }
  }

  try {
    fn(resolve, reject);
  } catch (err) {
    reject(err);
  }
}

myPromise.prototype.then = function(onFullFilled, onRejected) {
  const self = this;

  if (this.status === 'pending') {
    return new myPromise(function(resolve, reject) {
      // 还未决议
      self.onFulfilledCallback.push(function(value) {
        try {
          let x;
          // 保证值传递
          if (typeof onFullFilled === 'function') {
            x = onFullFilled(value);
          } else {
            resolve(value);
            return;
          }

          if (x instanceof myPromise) {
            // 返回值如果是 promise，就把当前 return 的promise的 resolve 传递给这个 promise, 保证链式调用
            x.then(resolve, reject);
            return;
          }
          resolve(x);
        } catch (err) {
          reject(err);
        }
      });

      self.onRejectedCallback.push(function(value) {
        try {
          let x;
          if (typeof onRejected === 'function') {
            x = onRejected(value);
          } else {
            reject(value);
            return;
          }

          if (x instanceof myPromise) {
            x.then(resolve, reject);
          }
          // 根据规范，如果 onFullFilled, onRejected 返回了一个值, then 方法就要返回 [[Resolve]](promise2, x)
          resolve(x);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  if (this.status === 'resolved') {
    return new myPromise(function(resolve, reject) {
      try {
        let x;
        // 保证值传递
        if (typeof onFullFilled === 'function') {
          x = onFullFilled(self.value);
        } else {
          resolve(self.value);
          return;
        }

        if (x instanceof myPromise) {
          // 返回值如果是 promise，就把当前 return 的promise的 resolve 传递给这个 promise, 保证链式调用
          x.then(resolve, reject);
          return;
        }

        resolve(x);
      } catch (err) {
        reject(err);
      }
    });
  }

  if (this.status === 'reject') {
    return new myPromise(function(resolve, reject) {
      try {
        let x;
        if (typeof onRejected === 'function') {
          x = onRejected(self.value);
        } else {
          reject(self.value);
          return;
        }

        if (x instanceof myPromise) {
          x.then(resolve, reject);
        }
        // 根据规范，如果 onFullFilled, onRejected 返回了一个值 then 方法就要返回 [[Resolve]](promise2, x)
        resolve(x);
      } catch (err) {
        reject(err);
      }
    });
  }
};

myPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
};

myPromise.all = function(promiseArr) {
  const result = [];

  return new myPromise((resolve, reject) => {
    try {
      let totalFull = 0;
      for (var i = 0; i < promiseArr.length; i++) {
        if (promiseArr[i] instanceof myPromise) {
          promiseArr[i].then(
            data => {
              totalFull++;
              result[i] = data;
              if (totalFull === promiseArr.length) {
                resolve(result);
              }
            },
            err => {
              reject(err);
            }
          );
          continue;
        }
        totalFull++;
        result[i] = promiseArr[i];
      }

      if (totalFull === promiseArr.length) {
        resolve(result);
      }
    } catch (err) {
      reject(err);
    }
  });
};

myPromise.resolve = function(value) {
  if (value instanceof myPromise) {
    return value;
  }

  if (typeof value === 'object' && typeof value.then === 'function') {
    return new myPromise((resolve, reject) => {
      value.then(resolve, reject);
    });
  }

  return new myPromise((resolve, reject) => {
    resolve(value);
  });
};

module.exports = myPromise;

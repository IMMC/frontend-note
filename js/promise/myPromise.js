function myPromise(fn) {
  this.status = 'pending';
  this.data = undefined;
  this.onFulfilledCallback = [];
  this.onRejectedCallback = [];
  var self = this;

  function resolve(value) {
    if (self.status === 'pending') {
      self.data = value;
      self.status = 'resolved';
      for (var i = 0; i < self.onFulfilledCallback.length; i++) {
        self.onFulfilledCallback[i](value);
      }
    }
  }

  function reject(reason) {
    if (self.status === 'pending') {
      self.data = reason;
      self.status = 'reject';
      for (var i = 0; i < self.onRejectedCallback.length; i++) {
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
  var fullFillFn =
    typeof onFullFilled === 'function'
      ? onFullFilled
      : function(v) {
          return v;
        };
  var rejectFn =
    typeof onRejected === 'function'
      ? onRejected
      : function(e) {
          return e;
        };

  var self = this;

  if (this.status === 'pending') {
    return new myPromise(function(resolve, reject) {
      // 还未决议
      self.onFulfilledCallback.push(function(value) {
        try {
          var x = fullFillFn(value);

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
          var x = rejectFn(value);

          if (x instanceof myPromise) {
            x.then(resolve, reject);
          }
          // 根据规范，如果 onFullFilled, onRejected 返回了一个值 then 方法就要返回 [[Resolve]](promise2, x)
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
        var x = fullFillFn(self.data);

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
        var x = rejectFn(self.data);

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
  var result = [];

  return new myPromise((resolve, reject) => {
    try {
      var totalFull = 0;
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
  }
};

// test code
new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(2);
  }, 1000);
}).then(data => {
  console.log('resolve data: ', data);
});

new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(3);
  }, 1000);
})
  .then()
  .then()
  .then(data => {
    console.log(data);
  });

// promise all

const promise1 = 1;
const promise2 = new myPromise((resolve, reject) => {
  resolve(6);
});
const promise3 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject('test');
  }, 2000);
});

const p = myPromise.all([promise1, promise2, promise3]).then(
  val => {
    console.log(val);
  },
  err => {
    console.log('error result: ', err);
  }
);

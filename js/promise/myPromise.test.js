const myPromise = require('./myPromise');

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

myPromise.all([promise1, promise2, promise3]).then(
  val => {
    console.log(val);
  },
  err => {
    console.log('error result: ', err);
  }
);
console.log(
  new myPromise((resolve, reject) => {
    reject('tet');
  }).then(
    () => {},
    () => {}
  )
);

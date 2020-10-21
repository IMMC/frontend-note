const { SyncHook, AsyncParallelHook } = require('tapable');

/**
 * SyncHook demo
 * 注册同步勾子
 * 通过 call 触发，会同步调用通过 tap 注册的回调
 */
console.log('***** sync Hook demo *****');
const syncHookDemo = new SyncHook(['name']);
syncHookDemo.tap('hello', name => {
  console.log(`hello ${name}`);
});
syncHookDemo.tap('hello again', name => {
  console.log(`hello ${name}, again`);
});

syncHookDemo.call('immc');

/**
 * 异步钩子
 * demo: AsyncParallelHook
 * 注册的所有异步回调都并行执行完毕之后再执行 callAsync 或者 promise 中的函数。
 * (顺序执行使用： AsyncSeriesHook)
 */
console.log('***** async Hook demo *****');
const asyncDemo = new AsyncParallelHook(['name']);

console.time('console');
asyncDemo.tapAsync('first', (name, cb) => {
  setTimeout(() => {
    console.log(`hello ${name}`);
    cb();
  }, 2000);
});

asyncDemo.tapPromise('second', name => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`second console: ${name}`);
      resolve();
    }, 3000);
  });
});

asyncDemo.callAsync('immc', () => {
  console.log('done');
  console.timeEnd('console');
});

/**
 * demo
 */
class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newSpeed']),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook(['source', 'target', 'routesList'])
    };
  }

  setSpeed(newSpeed) {
    // following call returns undefined even when you returned values
    this.hooks.accelerate.call(newSpeed);
  }
}

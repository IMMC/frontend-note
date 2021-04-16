function runner(gen) {
  const args = [].slice.call(arguments, 1);
  const it = gen.apply(this, args);

  return Promise.resolve().then(function handleNext(value) {
    const next = it.next(value);

    return (function handleResult(next) {
      if (next.done) {
        return next.value;
      }
      return Promise.resolve(next.value).then(handleNext, function handleErr(err) {
        return Promise.resolve(it.throw(err)).then(handleResult);
      });
    })(next);
  });
}

function timer(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 1000);
  });
}

function* main() {
  const result1 = yield timer(2);
  console.log(result1);
  console.log('first end');
  const result2 = yield timer(3);
  console.log(result2);
  console.log('second end');
}

// runner(main);

function myRunner(...args) {
  const funArgs = Array.prototype.slice(args, 1);
  const fn = args[0];

  const it = fn(...funArgs);

  function handleNext(value) {
    const next = it.next(value);

    if (next.done) {
      return next.value;
    }

    return Promise.resolve(next.value).then(handleNext);
  }

  return Promise.resolve().then(handleNext);
}

function* testMain() {
  yield myRunner(main);
  console.log('my runner finish');
}

myRunner(testMain);

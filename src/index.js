const { foo } = require('./foo');

function bar(arg = foo) {
  return arg;
}

bar(foo);

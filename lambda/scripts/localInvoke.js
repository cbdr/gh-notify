var lambda = require('../dist/index.js');

lambda.handler({}, {}, (err, results) => {
  console.log('HANLDER', err, results);
});

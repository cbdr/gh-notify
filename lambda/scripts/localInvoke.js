var lambda = require('./dist/main.js');

lambda.handler({}, {}, (err, results) => {
  console.log('HANLDER', err, results);
});

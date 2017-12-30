'use strict';

const { parse, stringify } = require('../lib');

const code = `
  {
    msg: "msg", // API Message
    data: [
      {
        author: "Paul Graham", // Book author
        name: "Hackers and Painters", // Book name
        show: true, // show
        age: 100, // age
        status: "DELETED" // book status
      }
    ],
    "code": "OK", // Business Code
  }
`;

const obj = {
  '// msg': 'API Message',
  msg: 'msg',
  data: [
    {
      author: 'Paul Graham',
      name: 'Hackers and Painters',
      '// author': 'Book author',
      show: true,
      '// name': 'Book name',
      age: 100,
      '// status': 'book status',
      status: 'DELETED',
    },
  ],
  code: 'OK',
};

// console.log(parse(code));
console.log('--------------------');
console.log(stringify(obj));

'use strict';

const { parse } = require('../lib');
// const f = data => JSON.stringify(data, null, 2);

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
    code: "OK" // Business Code
  }
`;

// const r = f(parse(code));
parse(code);
// console.log(parse(code));

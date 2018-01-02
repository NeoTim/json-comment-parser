'use strict';

const { parse, stringify } = require('../lib');

const code = `
{
  "msg":"some message",

  "success": true,
  "code": "OK",
  "data": [{
        "code":"edfaefbc",
        "name":"分享",
        "chances":1,
        "limitType":"DAY_LIMIT",
        "limitTimes":1,
        "startTime":1505475543658, // 时间戳
        "endTime":1505475543658 //时间戳
  },{
        "code":"edfaefebc",
        "name":"登录",
        "chances":1,
        "limitType":"DAY_LIMIT",
        "limitTimes":1,
        "startTime":1505475543658, // 时间戳
        "endTime":1505475543658 // 时间戳
  }
  ],
  "msg":"some message",
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

console.log(parse(code));
console.log('--------------------');
// console.log(stringify(obj));

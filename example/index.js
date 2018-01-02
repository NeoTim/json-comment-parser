'use strict';

const { parse, stringify } = require('../lib');

const code = `
{
  "success": true,
  "code": "OK",
  "data": {
      id: 11, // 任务ID
      code: 'qwerty', // 任务编号
      name: '分享', // 任务名称
      startTime: 1505378058000, // 任务开始时间
      endTime: 1505378058000, // 任务结束时间
      limitType: 'DAY_LIMIT', // 任务类型：UNLIMITED - 表示【无限制】 TOTAL_LIMIT - 表示【一共】 DAY_LIMIT - 表示【每天】
      limitTimes: 1, // 任务次数限制
      chances: 1, // 完成1次任务对应的机会奖励
      pageTask: false, // 是否允许页端触发任务完成：false - 【不允许】 true - 【允许】
      autoTask: true, // 是否为自动完成任务：false-【不是】 true-【是】
  },
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

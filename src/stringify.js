'use strict';

const acorn = require('acorn');
const estraverse = require('estraverse');
const JSON5 = require('json5');

module.exports = stringify;

function stringify(source) {
  const { comments, object } = extract(source);
  const nodes = [];
  let str = JSON5.stringify(object, null, 2);
  const ast = acorn.parse(`(${str})`);

  estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'Property' && node.value.hasOwnProperty('value')) {
        nodes.push(node);
      }
    },
  });

  nodes.reverse().forEach(node => {
    const { name } = node.key;
    const { start, end, value } = node.value;

    const find = comments.find(item => {
      return item.key === `// ${name}`;
    });
    if (find) {
      const realValue = typeof value === 'string' ? `"${value}"` : value;
      const valueWithComment = `${realValue}, // ${find.value}`;
      str = str.slice(0, start - 1) + valueWithComment + str.slice(end - 1);
    }
  });
  return str
    .split('\n')
    .map(item => {
      const reg = /\/\/.*,$/;
      if (reg.test(item)) {
        return item.replace(/,$/, '');
      }
      return item;
    })
    .join('\n');
}

function extract(source) {
  const comments = [];
  const object = handle(source);
  return { comments, object };

  function handle(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    const temp = obj.constructor();
    for (const key in obj) {
      if (typeof obj[key] !== 'string') {
        temp[key] = handle(obj[key]);
        continue;
      }

      const reg = /^\/\//;
      if (reg.test(key)) {
        comments.push({ key, value: obj[key] });
      } else {
        temp[key] = obj[key];
      }
    }

    return temp;
  }
}

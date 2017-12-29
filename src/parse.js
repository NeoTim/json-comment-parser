'use strict';

const acorn = require('acorn');
const estraverse = require('estraverse');

module.exports = parse;

function parse(source) {
  const comments = getComments(source);
  /* eslint-disable no-new-func */
  const obj = new Function(`return (${source})`)();
  const result = handleOrigin(obj);
  return result;

  function handleOrigin(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    const temp = obj.constructor();
    for (const key in obj) {
      if (typeof obj[key] !== 'string') {
        temp[key] = handleOrigin(obj[key]);
        continue;
      }

      const find = comments.find(item => item.key === `// ${key}`);
      if (find) {
        temp[`// ${key}`] = find.value;
      }
      temp[key] = obj[key];
    }

    return temp;
  }
}

function getComments(source) {
  const comments = [];
  const nodes = [];

  const ast = acorn.parse(`(${source})`, {
    locations: true,
    onComment: comments,
  });

  estraverse.replace(ast, {
    enter(node) {
      if (node.type === 'Identifier') {
        nodes.push(node);
      }
    },
  });

  return comments.map(item => {
    const commentLine = item.loc.start.line;
    const value = item.value.trim();
    const find = nodes.find(node => {
      return commentLine === node.loc.start.line;
    });
    if (!find) return {};
    return {
      key: `// ${find.name}`,
      value,
    };
  });
}

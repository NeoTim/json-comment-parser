'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var acorn = require('acorn');
var estraverse = require('estraverse');
var JSON5 = require('json5');

module.exports = stringify;

function stringify(source) {
  var _extract = extract(source),
      comments = _extract.comments,
      object = _extract.object;

  var nodes = [];
  var str = JSON5.stringify(object, null, 2);
  var ast = acorn.parse('(' + str + ')');

  estraverse.replace(ast, {
    enter: function enter(node) {
      if (node.type === 'Property' && node.value.hasOwnProperty('value')) {
        nodes.push(node);
      }
    }
  });

  nodes.reverse().forEach(function (node) {
    var name = node.key.name;
    var _node$value = node.value,
        start = _node$value.start,
        end = _node$value.end,
        value = _node$value.value;


    var find = comments.find(function (item) {
      return item.key === '// ' + name;
    });
    if (find) {
      var realValue = typeof value === 'string' ? '"' + value + '"' : value;
      var valueWithComment = realValue + ', // ' + find.value;
      str = str.slice(0, start - 1) + valueWithComment + str.slice(end - 1);
    }
  });
  return str.split('\n').map(function (item) {
    var reg = /\/\/.*,$/;
    if (reg.test(item)) {
      return item.replace(/,$/, '');
    }
    return item;
  }).join('\n');
}

function extract(source) {
  var comments = [];
  var object = handle(source);
  return { comments: comments, object: object };

  function handle(obj) {
    if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
      return obj;
    }

    var temp = obj.constructor();
    for (var key in obj) {
      if (typeof obj[key] !== 'string') {
        temp[key] = handle(obj[key]);
        continue;
      }

      var reg = /^\/\//;
      if (reg.test(key)) {
        comments.push({ key: key, value: obj[key] });
      } else {
        temp[key] = obj[key];
      }
    }

    return temp;
  }
}
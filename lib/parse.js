'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var acorn = require('acorn');
var estraverse = require('estraverse');

module.exports = parse;

function parse(source) {
  var comments = getComments(source);
  /* eslint-disable no-new-func */
  var obj = new Function('return (' + source + ')')();
  var result = handleOrigin(obj);
  return result;

  function handleOrigin(obj) {
    if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
      return obj;
    }

    var temp = {};

    var _loop = function _loop(key) {
      if (_typeof(obj[key]) === 'object') {
        temp[key] = handleOrigin(obj[key]);
      } else {
        var find = comments.find(function (item) {
          return item.key === '// ' + key;
        });
        if (find) {
          temp['// ' + key] = find.value;
        }
        temp[key] = obj[key];
      }
    };

    for (var key in obj) {
      _loop(key);
    }

    return temp;
  }
}

function getComments(source) {
  var comments = [];
  var nodes = [];

  var ast = acorn.parse('(' + source + ')', {
    locations: true,
    onComment: comments
  });

  estraverse.replace(ast, {
    enter: function enter(node) {
      if (node.type === 'Property') {
        nodes.push(node);
      }
    }
  });

  return comments.map(function (item) {
    var commentLine = item.loc.start.line;
    var value = item.value.trim();
    var find = nodes.find(function (node) {
      return commentLine === node.loc.start.line;
    });
    if (!find) return {};
    return {
      key: '// ' + (find.key.name || find.key.value),
      value: value
    };
  });
}
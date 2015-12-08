'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _immutability = require('immutability');

var _immutability2 = _interopRequireDefault(_immutability);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isArr = _immutability2.default.utils.types.isArr;

function flatten(arr) {
	if (isArr(arr)) {
		return arr.reduce(function (tmp, item) {
			if (!isArr(item)) {
				tmp.push(item);
			} else {
				tmp = tmp.concat(flatten(item));
			}
			return tmp;
		}, []);
	} else {
		return arr;
	}
}

function union(arr) {
	if (isArr(arr)) {
		return arr.reduce(function (tmp, item) {
			if (tmp.indexOf(item) == -1) {
				tmp.push(item);
			}
			return tmp;
		}, []);
	} else {
		return arr;
	}
}

function intersection(arr1, arr2) {
	return arr1.reduce(function (tmp, item) {
		if (arr2.indexOf(item) !== -1) {
			tmp.push(item);
		}
		return tmp;
	}, []);
}

function hasOwnProp(obj, name) {
	return obj.hasOwnProperty(name);
}

exports.default = _extends({}, _immutability2.default.utils, {
	IBDecorator: _immutability2.default,
	union: union,
	flatten: flatten,
	intersection: intersection,
	hasOwnProp: hasOwnProp
});
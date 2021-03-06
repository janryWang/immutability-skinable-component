(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("immutability"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["immutability", "react"], factory);
	else if(typeof exports === 'object')
		exports["Skinable"] = factory(require("immutability"), require("react"));
	else
		root["Skinable"] = factory(root["Immutability"], root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _utils = __webpack_require__(1);

	var _utils2 = _interopRequireDefault(_utils);

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var IBDecorator = _utils2.default.IBDecorator;
	var extend = _utils2.default.extend;
	var getProto = _utils2.default.getProto;
	var types = _utils2.default.types;
	var toArray = _utils2.default.toArray;
	var flatten = _utils2.default.flatten;
	var intersection = _utils2.default.intersection;
	var hasOwnProp = _utils2.default.hasOwnProp;
	var union = _utils2.default.union;
	var deepExtend = _utils2.default.deepExtend;
	var isFunc = types.isFunc;
	var isStr = types.isStr;
	var isObj = types.isObj;

	var EVENT_CONSTRUCTOR = 'EVENT_CONSTRUCTOR';

	var haveSkin = function haveSkin(val) {
		return this.indexOf(val) !== -1;
	};

	var SkinMaker = (function () {
		function SkinMaker(skins) {
			_classCallCheck(this, SkinMaker);

			this.registerSkins(skins);
		}

		_createClass(SkinMaker, [{
			key: 'registerSkins',
			value: function registerSkins(skins) {
				skins = toArray(skins);
				this.skins = union(skins.concat('default'));
				this.skinWidgets = {};
				return this;
			}
		}, {
			key: 'createWidgets',
			value: function createWidgets(name, skins) {
				if (isStr(name)) {
					this.skinWidgets[name] = skins || {};
				} else if (isObj(name)) {
					extend(this.skinWidgets, name);
				}
				return this;
			}
		}, {
			key: '_createStatics',
			value: function _createStatics() {
				var self = this;
				return {
					injectSkins: function injectSkins() {
						self.skins = union(flatten(toArray(arguments).concat(self.skins)));
						return this;
					},
					injectWidgets: function injectWidgets(name, skins) {
						if (isStr(name)) {
							self.skinWidgets[name] = skins || {};
						} else if (isObj(name)) {
							deepExtend(self.skinWidgets, name);
						}
						return this;
					}
				};
			}
		}, {
			key: '_createMixins',
			value: function _createMixins() {
				return {};
			}
		}, {
			key: '_createSkin',
			value: function _createSkin(_class_) {
				var self = this;

				function TmpClass() {
					var args = toArray(arguments);
					var injectArgs = [this].concat(args);
					this.skinWidgets = {};
					self._initWidgets.apply(self, injectArgs);
					return _class_.apply(this, args);
				}

				TmpClass.prototype = getProto(_class_);
				extend(getProto(TmpClass), this._createMixins());
				extend(TmpClass, _class_, this._createStatics());
				return TmpClass;
			}
		}, {
			key: '_initWidgets',
			value: function _initWidgets(context, props) {
				context.props = props;
				var skinWidgets = this.skinWidgets;
				var propsKeys = union(Object.keys(context.props).concat(['default']));
				var currentSkins = intersection(propsKeys, this.skins);
				var defaultSkin = function defaultSkin(props) {
					return _react2.default.createElement('noscripts', null);
				};
				var getElementCreator = function getElementCreator(Widget, oldWidget) {
					return function () {
						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						currentSkins.haveSkin = haveSkin;
						args[0] = _extends({}, args[0], {
							currentSkins: currentSkins,
							oldWidget: oldWidget
						});
						args.push(currentSkins);
						args.push(oldWidget);
						return Widget.apply(context, args);
					};
				};

				for (var name in skinWidgets) {
					if (hasOwnProp(skinWidgets, name)) {
						(function () {
							var widget = skinWidgets[name];
							var oldWidget = context.skinWidgets[name];
							if (isFunc(widget)) {
								context.skinWidgets[name] = getElementCreator(widget, oldWidget) || defaultSkin;
							} else if (isObj(widget)) {
								context.skinWidgets[name] = currentSkins.reduce(function (tmp, skinName) {
									if (!tmp && isFunc(widget[skinName])) {
										tmp = getElementCreator(widget[skinName], oldWidget);
									}
									return tmp;
								}, false) || defaultSkin;
							}
						})();
					}
				}
			}
		}]);

		return SkinMaker;
	})();

	function Skinable(SkinMakerInstance) {
		return function (_class_) {
			if (SkinMakerInstance && isFunc(SkinMakerInstance._createSkin)) {
				_class_ = SkinMakerInstance._createSkin(_class_);
			}
			_class_ = IBDecorator(_class_);
			return _class_;
		};
	}

	Skinable.registerSkins = function () {
		var skins = flatten(toArray(arguments));
		return new SkinMaker(skins);
	};

	Skinable.utils = _utils2.default;

	exports.default = Skinable;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _immutability = __webpack_require__(2);

	var _immutability2 = _interopRequireDefault(_immutability);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _IBDecorator$utils = _immutability2.default.utils;
	var types = _IBDecorator$utils.types;
	var toArray = _IBDecorator$utils.toArray;
	var isArr = types.isArr;
	var isObj = types.isObj;

	var isRef = function isRef(val) {
		return isArr(val) || isObj(val);
	};

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

	function deepExtend() {
		var args = toArray(arguments),
		    argLength;
		argLength = args.length;
		if (argLength == 1) {
			return args[0];
		} else if (argLength == 2) {
			if (isRef(args[0])) {
				for (var name in args[1]) {
					if (hasOwnProp(args[1], name)) {
						if (isRef(args[1][name]) && isRef(args[0][name])) {
							deepExtend(args[0][name], args[1][name]);
						} else {
							args[0][name] = args[1][name];
						}
					}
				}
				return args[0];
			} else {
				return args[0];
			}
		} else if (argLength > 2) {
			return deepExtend(args[0], deepExtend.apply(null, args.slice(1)));
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
		deepExtend: deepExtend,
		intersection: intersection,
		hasOwnProp: hasOwnProp
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _react = require('react');

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
var isFunc = types.isFunc;
var isStr = types.isStr;
var isObj = types.isObj;

var EVENT_CONSTRUCTOR = 'EVENT_CONSTRUCTOR';

var SkinMaker = (function () {
	function SkinMaker(skins) {
		_classCallCheck(this, SkinMaker);

		this.registerSkins(skins);
	}

	_createClass(SkinMaker, [{
		key: 'registerSkins',
		value: function registerSkins(skins) {
			this.skins = union(skins.concat(['default'])) || [];
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
					self.skins = flatten(toArray(arguments));
				},
				injectWidgets: function injectWidgets(name, skins) {
					if (isStr(name)) {
						self.skinWidgets[name] = skins || {};
					} else if (isObj(name)) {
						extend(self.skinWidgets, name);
					}
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
			extend(TmpClass, this._createStatics());
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

			for (var name in skinWidgets) {
				if (hasOwnProp(skinWidgets, name)) {
					(function () {
						var widget = skinWidgets[name];
						var oldWidget = context.skinWidgets[name];
						var newWdiget = undefined;
						if (isFunc(widget)) {
							try {
								newWdiget = widget(currentSkins, oldWidget);
								if (_react2.default.isValidElement(newWdiget)) {
									newWdiget = widget;
								}
							} catch (e) {
								newWdiget = widget;
							}

							context.skinWidgets[name] = newWdiget || defaultSkin;
						} else if (isObj(widget)) {
							console.log(currentSkins);
							newWdiget = currentSkins.reduce(function (tmp, skinName) {
								if (!tmp && isFunc(widget[skinName])) {
									try {
										tmp = widget[skinName](currentSkins, oldWidget);
										if (_react2.default.isValidElement(tmp)) {
											tmp = widget[skinName];
										}
									} catch (e) {
										tmp = widget;
									}
								}
								return tmp;
							}, false);

							context.skinWidgets[name] = newWdiget || defaultSkin;
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
		if (isFunc(SkinMakerInstance._createSkin)) {
			_class_ = SkinMakerInstance._createSkin(_class_);
		}
		IBDecorator(_class_);
		return _class_;
	};
}

Skinable.registerSkins = function () {
	var skins = flatten(toArray(arguments));
	return new SkinMaker(skins);
};

Skinable.utils = _utils2.default;

exports.default = Skinable;
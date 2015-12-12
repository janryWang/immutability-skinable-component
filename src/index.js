import utils from './utils';
import React from 'react';
const {IBDecorator,extend,getProto,types,toArray,flatten,intersection,hasOwnProp,union,deepExtend} = utils;

const {isFunc,isStr,isObj} = types;

const EVENT_CONSTRUCTOR = 'EVENT_CONSTRUCTOR';


class SkinMaker {

	constructor(skins) {
		this.registerSkins(skins);
	}

	registerSkins(skins) {
		skins = toArray(skins);
		this.skins = union(skins.concat('default'));
		this.skinWidgets = {};
		return this;
	}

	createWidgets(name, skins) {
		if (isStr(name)) {
			this.skinWidgets[name] = skins || {};
		} else if (isObj(name)) {
			extend(this.skinWidgets, name);
		}
		return this;
	}

	_createStatics() {
		let self = this;
		return {
			injectSkins(){
				self.skins = union(flatten(toArray(arguments).concat(self.skins)));
				return this;
			},
			injectWidgets(name, skins){
				if (isStr(name)) {
					self.skinWidgets[name] = skins || {};
				} else if (isObj(name)) {
					deepExtend(self.skinWidgets, name);
				}
				return this;
			}
		}
	}

	_createMixins() {
		return {}
	}

	_createSkin(_class_) {
		let self = this;
		function TmpClass () {
			let args = toArray(arguments);
			let injectArgs = [this].concat(args);
			this.skinWidgets = {};
			self._initWidgets.apply(self, injectArgs);
			return _class_.apply(this, args);
		}
		TmpClass.prototype = getProto(_class_);
		extend(getProto(TmpClass), this._createMixins());
		extend(TmpClass, _class_,this._createStatics());
		return TmpClass;
	}

	_initWidgets(context, props) {
		context.props = props;
		let skinWidgets = this.skinWidgets;
		let propsKeys = union(Object.keys(context.props).concat(['default']));
		let currentSkins = intersection(propsKeys,this.skins);
		let defaultSkin = props => <noscripts/>;

		for (let name in skinWidgets) {
			if (hasOwnProp(skinWidgets,name)) {
				let widget = skinWidgets[name];
				let oldWidget = context.skinWidgets[name];
				let newWdiget;
				if(isFunc(widget)){
					try{
						newWdiget = widget.call(currentSkins,oldWidget);
						if(React.isValidElement(newWdiget)){
							newWdiget = widget.bind(context);
						}
					}catch(e){
						newWdiget = widget.bind(context);
					}

					context.skinWidgets[name] = newWdiget || defaultSkin;
				} else if(isObj(widget)){
					newWdiget = currentSkins.reduce((tmp,skinName)=>{
						if(!tmp && isFunc(widget[skinName])){
							try{
								tmp = widget[skinName].call(context,currentSkins,oldWidget);
								if(React.isValidElement(tmp)){
									tmp = widget[skinName].bind(context);
								}
							}catch(e){
								tmp = widget.bind(context);
							}
						}
						return tmp;
					},false);

					context.skinWidgets[name] = newWdiget|| defaultSkin;
				}
			}
		}

	}


}

function Skinable(SkinMakerInstance) {
	return function (_class_) {
		if (SkinMakerInstance && isFunc(SkinMakerInstance._createSkin)) {
			_class_ = SkinMakerInstance._createSkin(_class_);
		}
		_class_ = IBDecorator(_class_);
		return _class_;
	}
}


Skinable.registerSkins = function () {
	let skins = flatten(toArray(arguments));
	return new SkinMaker(skins);
};

Skinable.utils = utils;

export default Skinable;

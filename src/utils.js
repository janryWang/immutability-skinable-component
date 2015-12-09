import IBDecorator from 'immutability';
const {types,toArray} = IBDecorator.utils;
const {isArr,isObj} = types;

const isRef = val => isArr(val) || isObj(val);

function flatten(arr) {
	if (isArr(arr)) {
		return arr.reduce((tmp, item)=> {
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
	var args = toArray(arguments), argLength;
	argLength = args.length;
	if (argLength == 1) {
		return args[0];
	} else if (argLength == 2) {
		if (isRef(args[0])){
			for (let name in args[1]) {
				if (hasOwnProp(args[1], name)) {
					if( isRef(args[1][name]) && isRef(args[0][name]) ) {
						deepExtend(args[0][name],args[1][name]);
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
		return arr.reduce((tmp, item)=> {
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
	return arr1.reduce((tmp, item)=> {
		if (arr2.indexOf(item) !== -1) {
			tmp.push(item);
		}
		return tmp;
	}, [])
}

function hasOwnProp(obj, name) {
	return obj.hasOwnProperty(name);
}

export default {
	...IBDecorator.utils,
	IBDecorator,
	union,
	flatten,
	deepExtend,
	intersection,
	hasOwnProp
}
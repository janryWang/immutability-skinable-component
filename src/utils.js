import IBDecorator from 'immutability';
const {isArr} = IBDecorator.utils.types;

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

function union(arr){
	if(isArr(arr)){
		return arr.reduce((tmp,item)=>{
			if(tmp.indexOf(item) == -1){
				tmp.push(item);
			}
			return tmp;
		},[]);
	} else {
		return arr;
	}
}

function intersection (arr1,arr2){
	return arr1.reduce((tmp,item)=>{
		if(arr2.indexOf(item) !== -1){
			tmp.push(item);
		}
		return tmp;
	},[])
}

function hasOwnProp (obj,name){
	return obj.hasOwnProperty(name);
}

export default {
	...IBDecorator.utils,
	IBDecorator,
	union,
	flatten,
	intersection,
	hasOwnProp
}
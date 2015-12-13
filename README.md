[![npm version](https://badge.fury.io/js/immutability-skinable-component.svg)](https://badge.fury.io/js/immutability-skinable-component)
[![Build Status](https://travis-ci.org/janryWang/immutability-skinable-component.svg)](https://travis-ci.org/janryWang/immutability-skinable-component)
[![Coverage Status](https://coveralls.io/repos/janryWang/immutability-skinable-component/badge.svg?branch=master&service=github)](https://coveralls.io/github/janryWang/immutability-skinable-component?branch=master)

immutability-skinable-component
===

##问题

1. 通用UI组件的皮肤管理，怎样一个管理方式比较优秀？
2. UI组件的扩展性怎样来保证？
3. 如何在保证扩展性的同时还能让整个组件结构变得更加优雅？
4. react组件的性能该如何提升?



##场景

1. 比如一个分页组件，在不同场景下会显示不同的分页结构，在过去的解决方案是使用一个模板引擎分别编译，但有一个问题，模板中的变量并不明确，又或者说不够优雅，不能让二次开发者很容易的上手进行二次开发扩展模板。

2. 根据皮肤来切换的粒度该如何控制？就像上面所说的，通过统一编译模板的方式，粒度则是从组件根部开始，没办法进行小粒度的定制化，这样对于二次开发者而言成本是巨大的，如果能做到部分扩展，比如一个图标，或者一个小按钮的皮肤化扩展，那就是一个非常棒的方案了。

3. 一个组件的结构，怎样在保证其优雅性的同时再让其很便捷的扩展？这都是我们在探索的方向。



##解决方案

1. 怎样解决组件的皮肤定制？

     我们希望在组件使用的时候可以很轻松的开发出支持多种皮肤的react组件，同时还能扩展该组件的皮肤

     所以，我这里提出了几个想法

      1. 组件在定义的时候定义皮肤枚举表

      2. 部件样式className可以根据皮肤名称添加后缀

      3. 部件的显示逻辑可以自动根据皮肤进行切换显示

      4. 可以给部件注入显示逻辑

      5. 组件样式定义利用postcss/packs/cssnext/css-modules

2. 怎样解决组件的性能问题？
	
	我所想的是结合[immutability](https://github.com/janryWang/immutability)，对其进行进一步封装，使得组件默认就是一个高性能的封装体，这样则可让开发者花更多的精力集中在业务上，而非各种性能的优化上。


```

let skins = skinable.registerSkins('large','middle','small','default')
.createWidgets('button',{
	default(props){
		return ...;
	}
}).createWidgets({//该模式可以解决多种皮肤组合使用的情景
	button(props){//每个widget的props会被注入两个属性,一个是currentSkins(Array),一个是oldWidget(Functional Component)
	   let {currentSkins,oldWidget} = props;
	   if(currentSkins.haveSkin('default')){
	   		return ....;
	   }
	}
}).createWidgets({
	button:{
		default(props){
		
		},
		large(props){
			
		}
	}
});

@skinable(skins)

class MyComponent extends Component {
    
    render(){
    	let {button} = this.skinWidgets;
    	let containerClassName = `${this.props.prefixCls}-myComponent`
    	return (
    		<div className={containerClassName}>
    			<button/>
    		</div>
    	);
    }

}

MyComponent.injectSkins('mobile').injectWidgets('button',{
	default:(skinNames,widget)=>{//这个skin是原来的defualt皮肤的widget,可以进行重用封装，也可以完全覆盖
		return function(props){
		
		};
	}
});

//组件使用

render(){
	return <MyComponent large mobile/>;
}


```

##使用教程

###安装

```
npm install --save immutability-skinable-component

```

###入门

组件定义

```

import Skinable from 'immutability-skinable-component';
import React,{Component} from 'react';

const skins = Skinable.createSkins('large','middle','small').createWidgets({
	Button:{
		default(props){
			let buttonClass = `${this.props.prefixCls}-default button`;
			let {ButtonIcon} = this.skinWidgets;
			return <a className={buttonClass}/><ButtonIcon />{this.props.buttonText}</a>
		}
	},
	ButtonIcon:{
		default(props){
			let buttonIconClass = `${this.props.prefixCls}-default button-icon arrow`
			return <i className={buttonIconClass}></i>
		}
	}
});

@Skinable() class Button extends Component {
	render(){
		let {Button} = this.skinWidgets;
		return <Button/>
	}

}



```

组件使用

```
ReactDOM.render(
	<Button default/>,
	document.body
);

```




##Q/A
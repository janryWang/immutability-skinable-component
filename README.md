Immutability
===

安装
===

    npm install --save immutability
    
介绍
===

React是一款非常棒的JS框架，它使得组件开发效率变得更高，同时借助它的虚拟dom的diff算法可以使得页面重绘次数大大减少，渲染性能大大提高。但是对于render而言，它的调用次数在默认情况下是不太可控的，因为render在调用之前会对state进行一次浅比较，如果oldState不等于nextState，就会调用render方法，很明显，如果state是一个庞大的树，或者存在一个大型数组结构，这样的比较方式是不够好的，无用的render次数太多，所以，我们必须进行深度比较，从而降低render次数，提高整体性能，但是对于深层比较，普通的深度遍历，其实还是有性能问题的，所以facebook创造了Immutable.js，它是利用了函数式中的持久化数据结构的优点，将对象与对象间的比较变得更加高效。所以利用Immutable.js完全可以大大提升react组件的性能。

但问题来了，怎样使用才是最佳的使用方式，我个人觉得，就要和原生的使用方式差不多，它不会让人觉得很唐突，所以Immutability出现了！

Immutability的出现只为增强react组件性能，同时降低开发者的学习成本。

它有几个优点：

1. 使用方便，利用es6的decorate
```javascript
import {IBDecorate} from 'immutability';
import {Component} from 'react';

@IBDecorate()
class Tmall extends Component{
	state = {
		say:"Hello world",
		rock:false
	}
	componnentDidMount(){
		let self = this;
		let {rock} = this.getState();
		setInterval(()=>{
			if(self.unmount) return;
			self.setState({
				say:rock ? 'Rock the world' : 'Hello world'
			});
		},1000);
	}
	componentWillUnmount(){
		this.unmount = true;
	}
	render(){
		return (
			<div>{this.getState('say')}</div>
	    	);
	}
}
```	    
	    
2. 学习成本非常低，只需要知道怎么使用`this.getState()`这个API就行，记住，获取状态，不要再和过去一样`this.state.say`这样来获取哦，当然如果你想访问深层对象，`this.getState('a.b.c.d[5]')`这样就OK了。

3. Immutable的API接口已集成到每个组件中，方便开发者使用,比如

	    this.toJS(),this.fromJS().....
   具体API文档请移步[ImmutableJS文档](https://facebook.github.io/immutable-js/docs)

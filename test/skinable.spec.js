import jsdomHelper from '../testHelper/jsdomHelper';
jsdomHelper();

import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Skinable from '../src';
import chai from 'chai';

var should = chai.should();
var expect = chai.expect;
var root = document.createElement('div');
window.document.body.appendChild(root);

describe('test api', function () {

	class TestComponent extends Component {
		render() {
			let {Container,Body,Header,Footer} = this.skinWidgets;
			return (
				<Container>
					<Header/>
					<Body/>
					<Footer/>
				</Container>
			);
		}
	}

	let skins = Skinable.registerSkins(['large', 'middle'], 'small');

	skins.createWidgets('Header', {
		default(){
			return <div className="header">I am a default skin header</div>
		},
		large(){
			return <div className="header">I am a large skin header</div>
		}
	}).createWidgets({
		Footer: {
			default(){
				return <div className="footer">I am a default skin footer</div>
			},
			large(){
				return ()=> {
					return <div className="footer">I am a large skin footer</div>
				}
			}
		},
		Body(skinNames){
			return ()=> {
				if (skinNames.indexOf('large') !== -1) {
					return <div className="body">I am a large skin body</div>
				} else {
					return <div className="body">I am a default skin body</div>
				}
			}
		},
		Container(props){
			return <div><div className="container">I am a container{props.children}</div></div>;
		}
	});


	TestComponent = Skinable(skins)(TestComponent);


	describe('test default component',function(){
		let defaultRoot = document.createElement('div');
		root.appendChild(defaultRoot);

		class DefaultContainer extends Component{

			componentDidMount(){
				let componentNode = ReactDOM.findDOMNode(this.refs.component);
				let containerNode = componentNode.querySelector('.container');
				let headerNode = componentNode.querySelector('.header');
				let bodyNode = componentNode.querySelector('.body');
				let footerNode = componentNode.querySelector('.footer');
				it('should equal I am a default skin container',()=>{
					expect(containerNode.innerHTML).to.have.string('I am a container');
				});

				it('should equal I am a default skin header',()=>{
					expect(headerNode.innerHTML).to.have.string('I am a default skin header');
				});

				it('should equal I am a default skin footer',()=>{
					expect(footerNode.innerHTML).to.have.string('I am a default skin footer');
				});

				it('should equal I am a default skin body',()=>{
					expect(bodyNode.innerHTML).to.have.string('I am a default skin body');
				});
			}

			render(){
				return <TestComponent ref="component"/>
			}
		}

		ReactDOM.render(
			<DefaultContainer/>,
			defaultRoot
		);

	});

	describe('test large component', function () {
		let largeRoot = document.createElement('div');
		root.appendChild(largeRoot);

		class LargeContainer extends Component{

			componentDidMount(){
				let componentNode = ReactDOM.findDOMNode(this.refs.component);
				let headerNode = componentNode.querySelector('.header');
				let bodyNode = componentNode.querySelector('.body');
				let footerNode = componentNode.querySelector('.footer');

				it('should equal I am a large skin header',()=>{
					expect(headerNode.innerHTML).to.have.string('I am a large skin header');
				});

				it('should equal I am a large skin footer',()=>{
					expect(footerNode.innerHTML).to.have.string('I am a large skin footer');
				});

				it('should equal I am a large skin body',()=>{
					expect(bodyNode.innerHTML).to.have.string('I am a large skin body');
				})
			}

			render(){
				return <TestComponent large ref="component"/>
			}
		}

		ReactDOM.render(
			<LargeContainer/>,
			largeRoot
		);

	});

	describe('test inject skins',function(){

	});

	describe('test utils api',function(){

	});

	describe('test immutability api',function(){

	})

});
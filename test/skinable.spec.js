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
					<Body text="this is props text"/>
					<Footer/>
				</Container>
			);
		}
	}

	let skins = Skinable.registerSkins(['large', 'middle'], 'small');

	skins.createWidgets('Header', {
		default(){
			let self = this;
			it('context need to equal current component context',()=>{
				self.should.to.have.property('getState');
			});
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
				return <div className="footer">I am a large skin footer</div>
			}
		},
		Body(props){
			if (props.currentSkins.haveSkin('large')) {
				return <div className="body">I am a large skin body {props.text}</div>
			} else {
				return <div className="body">I am a default skin body</div>
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
				});

				it('should have this is props text',()=>{
					expect(bodyNode.innerHTML).to.have.string('this is props text');
				});
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
		let mobileRoot = document.createElement('div');
		root.appendChild(mobileRoot);
		TestComponent.injectSkins('mobile').injectWidgets({
			Header:{
				mobile(){
					return <div className="header">I am a mobile skin header</div>
				}
			}
		});

		class MobileContainer extends Component{

			componentDidMount(){
				let componentNode = ReactDOM.findDOMNode(this.refs.component);
				let containerNode = componentNode.querySelector('.container');
				let headerNode = componentNode.querySelector('.header');
				let bodyNode = componentNode.querySelector('.body');
				let footerNode = componentNode.querySelector('.footer');

				it('should equal I am a default skin container',()=>{
					expect(containerNode.innerHTML).to.have.string('I am a container');
				});

				it('should equal I am a mobile skin header',()=>{
					expect(headerNode.innerHTML).to.have.string('I am a mobile skin header');
				});

				it('should equal I am a default skin footer',()=>{
					expect(footerNode.innerHTML).to.have.string('I am a default skin footer');
				});

				it('should equal I am a default skin body',()=>{
					expect(bodyNode.innerHTML).to.have.string('I am a default skin body');
				});
			}

			render(){
				return <TestComponent mobile ref="component"/>
			}
		}

		ReactDOM.render(
			<MobileContainer/>,
			mobileRoot
		);


	});

	describe('test utils api',function(){
		it('should have getState',()=>{
			TestComponent.prototype.should.have.property('getState');
		});

		it('should have setState',()=>{
			TestComponent.prototype.should.have.property('setState');
		});


		it('should have fromJS',()=>{
			TestComponent.prototype.should.have.property('fromJS');
		});

		it('should have utils',()=>{
			Skinable.utils.should.have.property('toArray');
		});

		it('should have types',()=>{
			Skinable.utils.types.should.have.property('isStr');
		});
	});

	describe('test immutability api',function(){
		class TestComponent extends Component {

			constructor(props) {
				super(props);
				this.state  = {
					say: "Hello world",
					dataArray:[
						{
							name:"abc"
						}
					],
					rock: false
				};
			}


			componentDidMount() {
				let self = this;
				let {rock} = this.getState();

				it('should be an Hello world', function (done) {

					setTimeout(()=> {
						if (self.unmount) return;
						self.setState({
							say: rock ? 'Rock the world' : 'Hello world',
							rock:!rock
						}, ()=> {
							if (rock) self.getState('say').should.be.equal('Rock the world');
							else self.getState('say').should.be.equal('Hello world');
							done();
						});
					}, 1000);

				})
			}

			componentWillUnmount() {
				this.unmount = true;
			}

			render() {
				let self = this;
				it('should be get the name',function(){
					self.getState('dataArray').getIn('0.name').should.be.equal('abc');
				});

				it('should be get the name',function(){
					self.getState('dataArray').getIn('[0].name').should.be.equal('abc');
				});

				it('should be get the name',function(){
					self.getState().getIn('dataArray[0].name').should.be.equal('abc');
				});

				return (
					<div>{this.getState('say')}</div>
				);
			}
		}

		TestComponent = Skinable(skins)(TestComponent);

		ReactDOM.render(
			<TestComponent/>,
			root
		);
	})

});
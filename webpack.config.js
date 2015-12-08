var webpack = require('webpack');

module.exports = {
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel', exclude: /node_modules/,query: {
				cacheDirectory: true,
				presets: ['es2015','react','stage-0']
			} }
		]
	},
	externals:{
		'react': {
			root: 'React',
			commonjs2: 'react',
			commonjs: 'react',
			amd: 'react'
		},
		'immutable': {
			root: 'Immutable',
			commonjs2: 'immutable',
			commonjs: 'immutable',
			amd: 'immutable'
		},
		'immutability': {
			root: 'Immutability',
			commonjs2: 'immutability',
			commonjs: 'immutability',
			amd: 'immutability'
		}
	},
	output: {
		library: 'Skinable',
		libraryTarget: 'umd'
	},
	resolve: {
		extensions: ['', '.js']
	}
};
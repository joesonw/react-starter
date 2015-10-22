var path = require('path');

module.exports = {
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: 'style-loader/useable!css-loader'

			},{
				test:/\.jsx?$/,
				exclude:/(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					stage: 0	
				},
				exclude: [path.resolve(__dirname, 'node_modules')]
			}
		]
	},
	resolve: {
		extensions: ['','.js','.jsx'],
		modulesDirectories: ['node_modules','src']
	}
};

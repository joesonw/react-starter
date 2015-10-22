module.exports = {
	debug:true,
	entry: 'src/entry.js',
	buildDirectory: './builds',
	external:{ // replace module with web cdn version
		'react:React': '//cdnjs.cloudflare.com/ajax/libs/react/0.14.0/react.js',
		'react-dom:ReactDOM': '//cdnjs.cloudflare.com/ajax/libs/react/0.14.0/react-dom.js',
	},
	bundle: {
		'libraries': {
			path: './src/libraries',
			isDirectory: true,
			entry: 'index.js'
		},
		'components': {
			path: './src/components',
			isDirectory: true,
			entry: '[name].jsx'
		},
		'decorators': {
			path: './src/decorators',
			isDirectory: false
		}
	},
	vendor: ['lodash']
}
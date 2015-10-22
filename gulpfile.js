var gulp = require('gulp');
var gutil = require('gulp-util');
var config = require('./config.js');
var jade = require('gulp-jade');
var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var del = require('del');
var path = require('path');
var fs = require('fs');

gulp.task('clean',function(cb) {
	del(config.buildDirectory)
	.then(function() {
		cb();
	})
	.catch(function(err) {
		cb(err);
	})
});

gulp.task('buildIndex',['clean'],function(cb) {
	var externalScripts = [];
	// cdn libraries
	for (var key in config.external) {
		externalScripts.push(config.external[key]);
	}
	for (var key in config.bundle) {
		externalScripts.push(key + '.js');
	}
	if (config.vendors) {
		externalScripts.push('vendors.js');
	}
	return gulp.src('src/index.jade')
			.pipe(jade({
				locals: {
					entry: 'app.js',
					externalScripts: externalScripts
				}
			}))
			.pipe(gulp.dest(config.buildDirectory))
});

gulp.task('webpack:buildBundle',['clean'],function(cb) {
	webpackConfig.externals 	= webpackConfig.externals || {};
	webpackConfig.resolve 		= webpackConfig.resolve || {};
	webpackConfig.resolve.alias = webpackConfig.resolve.alias || {};
	webpackConfig.entry 		= webpackConfig.entry || {};
	webpackConfig.entry.app		= path.resolve(__dirname,config.entry)
	webpackConfig.output = {
		path: config.buildDirectory,
		filename: '[name].js'
	};
	webpackConfig.plugins = webpackConfig.plugins || [];
	webpackConfig.plugins.push(new webpack.optimize.DedupePlugin())


	for (var key in config.bundle) {
		var bundle = config.bundle[key];
		if (bundle.isDirectory)	{
			var bundleParts = fs.readdirSync(bundle.path);
			var bundleFiles = [];
			for (var p of bundleParts) {
				var entry = bundle.entry;
				entry = entry.replace(/\[name\]/ig,p);
				bundleFiles.push(bundle.path + '/' + p + '/' + entry);
			}
			webpackConfig.entry[key] = bundleFiles;
			var c = {
				name: key,
				filename: key + '.js'
			};
			if (bundle.entry !== 'index.js') {
				c.children = true;
			}
			webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin(c));
		} else {
			var bundleParts = fs.readdirSync(bundle.path);
			var bundleFiles = [];
			for (var f of bundleParts) {
				bundleFiles.push(bundle.path + '/' + f);
			}
			webpackConfig.entry[key] = bundleFiles;
			webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
				name: key,
				filename: key + '.js',
				children: true
			}));
		}
	}

	if (config.vendor) {
		//webpackConfig.entry['vendor'] = config.vendor;
		webpackConfig.entry['vendor'] = ['lodash'];
		webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
			name:'vendor',
			filename:'vendor.js',
			children: true
		}));
	}

	//cdn libraries
	for (var key in config.external) {
		var name = key.split(':')[0];
		var external = key.split(':')[1];
		webpackConfig.externals[name] = external;
	}

	webpack(webpackConfig,function(err,stats) {
		if (err) throw new gutil.PluginError('webpack',err);
		gutil.log('[webpack]',stats.toString());
		cb();
	});
});


gulp.task('build',['clean','webpack:buildBundle','buildIndex'],function() {

});



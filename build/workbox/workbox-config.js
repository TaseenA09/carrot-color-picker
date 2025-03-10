module.exports = {
	globDirectory: './dist',
	globPatterns: [
		'*.{js,css,ttf,svg,html,json}',
		'./icons/*.svg'
	],
	maximumFileSizeToCacheInBytes: 4194000,
	swDest: './dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	runtimeCaching: [{
		urlPattern: new RegExp('/.*/'),
		handler: "NetworkFirst",
	}]
};

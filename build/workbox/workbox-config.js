module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{js,css,ttf,svg,html,json}'
	],
	maximumFileSizeToCacheInBytes: 4194000,
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	runtimeCaching: [{
		urlPattern: new RegExp('/.*/'),
		handler: "NetworkOnly",
	}]
};

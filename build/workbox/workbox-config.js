module.exports = {
	globPatterns: [
		'./dist/*.{js,css,ttf,svg,html,json}',
		'./dist/icons/*.{svg}'
	],
	maximumFileSizeToCacheInBytes: 4194000,
	swDest: './dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	runtimeCaching: [{
		urlPattern: new RegExp('/.*/'),
		handler: "NetworkOnly",
	}]
};

module.exports = {
	globDirectory: 'src/',
	globPatterns: [
		'**/*.{json,js,css,ttf,svg,html}'
	],
	maximumFileSizeToCacheInBytes: 4194000,
	swDest: 'src/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};

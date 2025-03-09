module.exports = {
	globPatterns: [
		'./*.{js,css,svg,html}',
		'./icons/*.{svg}'
	],
	maximumFileSizeToCacheInBytes: 4194000,
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	runtimeCaching: [{
		urlPattern: new RegExp('.*'),
		handler: "NetworkFirst",
		options: {
			cacheName: "carrotcolorpickerswcache",
			networkTimeoutSeconds: 3,
		}
	}]
};

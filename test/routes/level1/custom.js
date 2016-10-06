module.exports = function(router, info) {
	router.get  (info.path + '/custom', function* () { return 'get level1/custom.js'})
	router.post (info.path + '/custom', function* () { return 'post level1/custom.js'})
	router.put  (info.path + '/custom', function* () { return 'put level1/custom.js'})
	router.del  (info.path + '/custom', function* () { return 'del level1/custom.js'})
}
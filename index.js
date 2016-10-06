'use strict';
const koaRouter = require('koa-router');
const path      = require('path');
const Promise   = require("bluebird");
const fs        = Promise.promisifyAll(require('fs'));


module.exports = function (path, options) {
	options = options || {};

	const router = options.router || koaRouter();

	return registerRoutes(path, router, '').then(() => {
		return router;
	});
}

function registerRoutes(folder, router, url) {

	router.use(function* (next) {
		if (this.request.url === url) { // missing trailing slash
			return this.redirect(`${url}/`);
		} else {
			yield next;
		}
	});

	return fs.readdirAsync(folder).then(names => {

		names = names.sort();

		let idx = names.indexOf('index.js');
		if (idx !== -1) {
			names.splice(idx, 1);
			names.unshift('index.js');
		}


		return Promise.reduce(names, (_acc, name) => {

			const filePath = folder + path.sep + name;

			return fs.statAsync(filePath).then(stat => {

				if (stat.isDirectory()){
					return registerRoutes(filePath, router, url + '/' + name);
				}
				else if (stat.isFile() && name.match(/.js$/)) {

					const urlFileName = name === 'index.js'
						? ''
						: name.replace(/.js$/, '');


					try {
						const module = require(filePath);

						if (typeof(module) === 'function') module(router, {path: url});

						if (module.get) router.get(url + '/' + urlFileName, module.get);
						if (module.post) router.post(url + '/' + urlFileName, module.post);
						if (module.put) router.put(url + '/' + urlFileName, module.put);
						if (module.del) router.del(url + '/' + urlFileName, module.del);
					} catch(err) {
						console.error('Unable to load route handler in %s', filePath);
						console.error(err);
					}
				}
			});
		}, 1);
	});
}

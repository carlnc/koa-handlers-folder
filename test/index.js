'use strict'
const khf = require('../');
const assert = require('assert');

function MockRouter() {

	const routes = [];
	const save = (method) => (route, genFn) => {
		routes.push({method, route, genFn});
	}

	return {
		get:  save('get'),
		post: save('post'),
		put:  save('put'),
		del:  save('del'),
		use:  save('use'),

		getResult: () => {
			return routes;
		}
	}
}


const expect = [
  { method: 'use'},
  { method: 'get',  route: '/'},
  { method: 'use'},
  { method: 'get',  route: '/level1/'},
  { method: 'get',  route: '/level1/custom'},
  { method: 'post', route: '/level1/custom'},
  { method: 'put',  route: '/level1/custom'},
  { method: 'del',  route: '/level1/custom'},
  { method: 'get',  route: '/level1/otherFile'},
  { method: 'post', route: '/level1/otherFile'},
  { method: 'put',  route: '/level1/otherFile'},
  { method: 'del',  route: '/level1/otherFile'}
];

khf('./test/routes', {router: new MockRouter()}).then(router => {
	const results = router.getResult();

	console.log('expect:', expect);
	console.log('results:', results);

	expect.forEach((exp, idx) => {

		assert(exp.method === results[idx].method);
		
		if (exp.method !== 'use') {
			assert(exp.route  === results[idx].route);
		}
	});

	console.log('All good');
});



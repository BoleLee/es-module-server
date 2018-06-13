const Koa = require('koa');
const path = require('path');
const app = new Koa();

const config = {
	port: 10000,
}
const serve = require('koa-static');
app.use(serve(path.join(__dirname, 'static')));

if (!module.parent) {
    app.listen(config.port);
	console.log('\n listening on port ' + config.port);
}
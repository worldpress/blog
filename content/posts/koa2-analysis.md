---
title: Koa2 源码分析
date: 2017-05-17
tags:
  - Koa
  - Node.js
categories:
  - 思考总结
---

## 源码结构

Koa 的源码中主要为 `lib` 目录下的 `application.js`、`context.js`、`request.js` 与 `response.js` 文件

<!--more-->

```
.
├── AUTHORS
├── CODE_OF_CONDUCT.md
├── History.md
├── LICENSE
├── Makefile
├── Readme.md
├── benchmarks
├── docs
├── lib
│   ├── application.js
│   ├── context.js
│   ├── request.js
│   └── response.js
├── package.json
└── test
```

**application.js**: 框架入口，导出 Application 类，即使用时导入的 Koa 类

**context.js**: context 对象的原型，代理 request 与 response 对象

**request.js**:  request 对象的原型，提供请求相关的数据与操作

**response.js**: response 对象的原型，提供响应相关的数据与操作

## Application

application.js 是 Koa 框架的入口，导出 Application 类来用于创建 app 对象。

```js
const Koa = require('koa'); // 导入 Koa, 即导入 Application 类
const app = new Koa(); // 创建 Application 类的实例
```

Application 继承于 EventEmitter 类，使得 Koa 能够监听事件。

## 构造函数

Application 类包含了以下属性：

* **proxy**: 是否信任 proxy header 参数，默认为 false
* **middleware**: 保存通过 `app.use(middleware)` 注册的中间件
* **subdomainOffset**: 子域默认偏移量，默认为 2
* **env**: 环境参数，默认为 NODE\_ENV 或 'development'
* **context**: context 模块，通过 `context.js` 创建
* **request**: request 模块，通过 `request.js` 创建
* **response**: response 模块，通过 `response.js` 创建

## Application\#listen

Koa 通过 `app.listen(port)` 函数在某个端口启动服务。

listen 函数通过 http 模块开启服务：

```js
/**
 * Shorthand for:
 *
 *    http.createServer(app.callback()).listen(...)
 *
 * @param {Mixed} ...
 * @return {Server}
 * @api public
 */

listen(...args) {
  debug('listen');
  const server = http.createServer(this.callback());
  return server.listen(...args);
}
```

实际上 `app.listen()`为 `http.createServer(app.callback()).listen(...)`的速记写法。

`http.createServer()`用于创建 Web 服务器，接受一个请求监听函数，并在得到请求时执行。

`app.callback()`用于处理请求，合并中间件与创建请求上下文对象等。

### Application\#use

Koa 通过 `app.use()`添加中间件，并将中间件储存在 `app.middleware`中。

在执行 `app.callback()`时会将 `app.middleware` 中的中间件合并为一个函数。

```js
/**
 * Use the given middleware `fn`.
 *
 * Old-style middleware will be converted.
 *
 * @param {Function} fn
 * @return {Application} self
 * @api public
 */

use(fn) {
  if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
  if (isGeneratorFunction(fn)) {
    deprecate('Support for generators will be removed in v3. ' +
              'See the documentation for examples of how to convert old middleware ' +
              'https://github.com/koajs/koa/blob/master/docs/migration.md');
    fn = convert(fn);
  }
  debug('use %s', fn._name || fn.name || '-');
  this.middleware.push(fn);
  return this;
}
```

Koa1.x 版本使用 Generator Function 的方式写中间件，而 Koa2 改用 ES6 async/await。

所以在 `use()` 函数中会判断是否为旧风格的中间件写法，并对旧风格写法的中间件进行转换（使用 [koa-convert](https://github.com/koajs/convert) 进行转换）。

可以注意到这里 `use()` 函数返回了 this，这使得在添加中间件的时候能够链式调用。

```js
app
  .use(function (ctx, next) {
    // do some thing
  })
  .use(function (ctx, next) {
    // do some thing
  })
  // ...
```

### Application\#callback

`app.callback()`负责合并中间件，创建请求上下文对象以及返回请求处理函数等。

```js
  /**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */

  callback() {
    const fn = compose(this.middleware);

    if (!this.listeners('error').length) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      res.statusCode = 404;
      const ctx = this.createContext(req, res);
      const onerror = err => ctx.onerror(err);
      const handleResponse = () => respond(ctx);
      onFinished(res, onerror);
      return fn(ctx).then(handleResponse).catch(onerror);
    };

    return handleRequest;
  }
```

通过 `compose` 函数（[koa-compose](https://github.com/koajs/compose)）合并 `app.middleware`中的所有中间件。[查看](/koa/compose.md)关于 koa-compose 的分析。

`app.callback()` 函数最后返回一个请求处理函数 `handleRequest`。该函数即为`http.createServer` 接收的请求处理函数，在得到请求时执行。

#### handleRequest

`handleRequest`函数首先将响应状态码默认设置为 404，接着通过 `app.createContext()`创建请求的上下文对象。

`onFinished(res, onerror)`通过第三方库 [on-finished](https://github.com/jshttp/on-finished) 监听 http response，当请求结束时执行回调。

这里传入的回调是 `context.onerror(err)`，即当错误发生时才执行。

最后返回 `fn(ctx).then(handleResponse).catch(onerror)`，即将所有中间件执行（传入请求上下文对象 ctx），之后执行响应处理函数（`app.respond(ctx)`），当抛出异常时同样使用 `cintext.onerror(err)`处理。

#### createContext

app.createContext\(\) 用来创建请求上下文对象，并代理 Koa 的 request 和 response 模块。

```js
/**
 * Initialize a new context.
 *
 * @api private
 */

createContext(req, res) {
  const context = Object.create(this.context);
  const request = context.request = Object.create(this.request);
  const response = context.response = Object.create(this.response);
  context.app = request.app = response.app = this;
  context.req = request.req = response.req = req;
  context.res = request.res = response.res = res;
  request.ctx = response.ctx = context;
  request.response = response;
  response.request = request;
  context.originalUrl = request.originalUrl = req.url;
  context.cookies = new Cookies(req, res, {
    keys: this.keys,
    secure: request.secure
  });
  request.ip = request.ips[0] || req.socket.remoteAddress || '';
  context.accept = request.accept = accepts(req);
  context.state = {};
  return context;
}
```

这里对请求都对应在上下文对象中添加对应的 cookies。

#### respond

`app.respond(ctx)` 函数，也就是 `app.createContext()`函数中的 `handleResponse`。在所有中间件执行完之后执行。

在 koa 中可以通过设置 `ctx.respond = false`来跳过这个函数，但不推荐这样做。另外，当上下文对象不可写时也会退出该函数：

```js
if (false === ctx.respond) return;
// ...
if (!ctx.writable) return;
```

当返回的状态码表示没有响应主体时，将响应主体置空：

```js
// ignore body
if (statuses.empty[code]) {
  // strip headers
  ctx.body = null;
  return res.end();
}
```

当请求方法为 HEAD 时，判断响应头是否发送以及响应主体是否为 JSON 格式，若满足则设置响应 Content-Length：

```js
if ('HEAD' == ctx.method) {
  if (!res.headersSent && isJSON(body)) {
    ctx.length = Buffer.byteLength(JSON.stringify(body));
  }
  return res.end();
}
```

当返回的状态码表示有响应主体，但响应主体为空时，将响应主体设置为响应信息或状态码。并当响应头未发送时设置 Content-Type 与 Content-Length：

```js
if (null == body) {
  body = ctx.message || String(code);
  if (!res.headersSent) {
    ctx.type = 'text';
    ctx.length = Buffer.byteLength(body);
  }
  return res.end(body);
}
```

最后，对不同的响应主体进行处理：

```js
// responses
if (Buffer.isBuffer(body)) return res.end(body);
if ('string' == typeof body) return res.end(body);
if (body instanceof Stream) return body.pipe(res);

// body: json
body = JSON.stringify(body);
if (!res.headersSent) {
  ctx.length = Buffer.byteLength(body);
}
res.end(body);
```

## Compose

在 application.js 中，`callback()`函数通过 `koa-compose` 组合所有的中间件，组合成单个函数。

koa-compose  的实现很简单：

```js
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, function next () {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

首先判断了传入得中间件参数是否为数组，并检查且数组的元素是否为函数，然后返回了一个将中间件组合起来的函数。

重点关注返回的函数中的`dispatch(i)`函数，这个函数将获取第一个中间件，并在返回的 Promise 中执行。当中间件`await next()`时执行下一个中间件，即 `dispatch(i + 1)`。

执行流程可以简单看作：

```js
async function middleware1() {
    console.log('middleware1 begin');
    await middleware2();
    console.log('middleware1 end');
}

async function middleware2() {
    console.log('middleware2 begin');
    await middleware3();
    console.log('middleware2 end');
}

function middleware3() {
    console.log('middleware3 begin');
    console.log('middleware3 end');
}

middleware1();
// 执行结果
middleware1 begin
middleware2 begin
middleware3 begin
middleware3 end
middleware2 end
middleware1 end
```

`compose()` 函数通过 Promise 将这个过程串联起来，从而返回单个中间件函数。

## Context

Koa 中的 Context 模块封装了 request 与 response，代理了这两个对象的方法与属性。

其中使用了 Tj 写的 [node-delegates](https://github.com/tj/node-delegates) 库，用于代理 context.request 与 context.response 上的方法与属性。

```js
/**
 * Response delegation.
 */

delegate(proto, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');
  // ...
```

context 除了代理这两个模块之外，还包含了一个请求异常时的错误处理函数。

在 application.js 的 `callback()`使用到这个函数。

```js
const onerror = err => ctx.onerror(err);
const handleResponse = () => respond(ctx);
onFinished(res, onerror);
return fn(ctx).then(handleResponse).catch(onerror);
```

### Context\#onerror

`context.onerror(err)`首先对传入的 err 变量进行判断，当 err 为空时退出该函数，或者当 err 不为空且不为 Error 类型时抛出异常。

```js
 if (null == err) return;

 if (!(err instanceof Error)) err = new Error(`non-error thrown: ${err}`);
```

接着触发 app 自身的 error 事件，将错误抛给 app。

在此之前，设置 `headerSent`变量表示响应头是否发送，若响应头以发送，或者不可写（即无法在响应中添加错误信息等），则退出该函数。

```js
let headerSent = false;
if (this.headerSent || !this.writable) {
  headerSent = err.headerSent = true;
}

// delegate
this.app.emit('error', err, this);

// nothing we can do here other
// than delegate to the app-level
// handler and log.
if (headerSent) {
   return;
}
```

因为发生了错误，所以必须将之前的中间设置的响应头信息清空。

这里使用了 Node 提供的 [http.ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) 类上的 `getHeaderNames()` 与 `removeHeader()` 方法。但`getHeaderNames()`

这个函数是在 Node.js 7.7 时加入的，所以当没有提供该方法时需要使用 `_header`来清空响应头。详情可见: [Node.js \#10805。](https://github.com/nodejs/node/pull/10805)

```js
// first unset all headers
if (typeof res.getHeaderNames === 'function') {
  res.getHeaderNames().forEach(name => res.removeHeader(name));
} else {
  res._headers = {}; // Node < 7.7
}
```

清空之前的中间件设置的响应头之后，将响应头设置为 `err.headers`，并设置 Context-Type 与状态码。

当错误码为 ENOENT 时，意味着找不到该资源，将状态码设置为 404；当没有状态码或状体啊码错误时默认设置为 500。

```js
// then set those specified
this.set(err.headers);

// force text/plain
this.type = 'text';

// ENOENT support
if ('ENOENT' == err.code) err.status = 404;

// default to 500
if ('number' != typeof err.status || !statuses[err.status]) err.status = 500;
```

最后当抛出的错误为自定义错误时，返回错误信息。

Koa 使用 [http-errors](https://github.com/jshttp/http-errors) 创建错误对象，`expose` 属性表示是否像客户端暴露错误信息。

```js
const code = statuses[err.status];
const msg = err.expose ? err.message : code;
this.status = err.status;
this.length = Buffer.byteLength(msg);
this.res.end(msg);
```

## Request

Request 模块封装了请求相关的属性以及方法。通过 application 中的 `createContext()` 方法，代理对应的 request 对象。

```js
const request = context.request = Object.create(this.request);
// ...
context.req = request.req = response.req = req;
// ...
request.response = response;
```

`request.req`为原生的请求对象，在 Request 模块中属性的获取都是通过 `ths.req` 来获取的（即 `request.req`）。

## Response

Response 模块封装了响应相关的属性以及方法。与 request 相同，通过`createContext()` 方法代理对应的 response 对象。

```js
const response = context.response = Object.create(this.response);
// ...
context.res = request.res = response.res = res;
// ...
response.request = request;
```

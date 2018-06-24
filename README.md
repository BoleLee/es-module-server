
## 运行
```
npm install

node server.js
```
访问`http://localhost:10000`查看测试例子，请打开控制台观察


# 浏览器中的ECMAScript Modules

原文地址：https://jakearchibald.com/2017/es-modules-in-browsers/

## 浏览器支持情况

- Safari 10.1.
- Chrome 61.
- Firefox 54 – behind the dom.moduleScripts.enabled setting in about:config.
- Edge 16.

查询此表：https://kangax.github.io/compat-table/es6/

## 标识 type="module"

```
// hello.js
export function hello() {
    alert('Hello World');
    console.log('Hello World')
}

// index.html
<script type="module">
import { hello } from './hello.js'

hello()
</script>
```

## 支持的文件路径

```
// Supported:
import {foo} from 'https://jakearchibald.com/utils/bar.js';
import {foo} from '/utils/bar.js';
import {foo} from './bar.js';
import {foo} from '../bar.js';

// Not supported:
import {foo} from 'bar.js';
import {foo} from 'utils/bar.js';
```
- 完整url地址
- 以`/`开头
- 以`./`开头
- 以`../`开头

> 注：！这意味着无法通过浏览器直接访问某个html文件的方式使用module，其加载路径将为`file://`, 必须借助server框架

## 使用nomodules做优雅降级

```
<script type="module" src="module.js"></script>
<script nomodule src="fallback.js"></script>
```

支持`type=module`的浏览器会忽略带`nomodule`的脚本，反之亦然

## type=module的脚本默认为defer

```
<!-- This script will execute after… -->
<script type="module" src="1.js"></script>

<!-- …this script… -->
<script src="2.js"></script>

<!-- …but before this script. -->
<script defer src="3.js"></script>
```
一般脚本可以添加`defer`以防止阻塞，同时这会延迟脚本执行直到文档解析完毕；module脚本默认行为是defer, 获取该文件时绝对不会阻塞HTML解析。

modules脚本与使用defer属性的一般脚本执行顺序一致。

一般的`inline script`会忽略`defer`, 但`inline module script`同样默认`defer`

## 外链或行内module脚本均可添加async属性

```
<!-- This executes as soon as its imports have fetched -->
<script async type="module">
  import {addTextToBody} from './utils.js';

  addTextToBody('Inline module executed.');
</script>

<!-- This executes as soon as it & its imports have fetched -->
<script async type="module" src="1.js"></script>
```
对于一般script，`async`使得脚本下载过程中不会阻塞HTML解析，同时尽可能快地执行。与一般脚本不同的是，`async`对于行内module脚本也起作用。

## 同一个module脚本只会加载一次

```
<!-- 1.js only executes once -->
<script type="module" src="1.js"></script>
<script type="module" src="1.js"></script>
<script type="module">
  import "./1.js";
</script>

<!-- Whereas normal scripts execute multiple times -->
<script src="2.js"></script>
<script src="2.js"></script>
```

## 获取module脚本是跨域(CORS)的

与一般脚本不同，module脚本以及它所`import`的文件，获取都是跨域的。这意味着`module scripts`必须返回有效`CORS headers`，比如：`Access-Control-Allow-Origin: *`

## 无需凭证 - No credentials

如果请求是同源的，大多数`CORS APIs`将会发送凭证（如cookies等），但`fetch(), module scripts`例外，它们不发凭证，除非指定需要凭证。

可以通过添加`crossorigin`属性，给同源的module添加凭证，（[虽然这在我看来有些奇怪，我也提出了这个问题](https://github.com/whatwg/html/issues/2557)）。对于其他origin的，如果也想添加凭证，使用`crossorigin="use-credentials"`，这样其他origin不得不回应header: `Access-Control-Allow-Credentials: true`

对于上面提到的“module只加载一次”的规则，如果你先请求一个不需要凭证的module，又请求需要凭证的同一个module, 那么你得到的是无凭证的module.

## 必须为Mime-types

与一般script不同，module scripts必须为[有效的JavaScript MIME types之一](https://html.spec.whatwg.org/multipage/scripting.html#javascript-mime-type)，否则将不会执行

## Thanks

[@Mywifi](https://github.com/Mywifi)

## 相关资料

- [ES6浏览器支持表](https://kangax.github.io/compat-table/es6/)

- [ECMAScript modules in browsers ](https://jakearchibald.com/2017/es-modules-in-browsers/)

- [ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)
- [译文：图说ES Module](https://segmentfault.com/a/1190000014318751)

- [ES6 Modules in Depth](https://ponyfoo.com/articles/es6-modules-in-depth)

- [An overview of ES6 Modules in JavaScript](https://blog.cloud66.com/an-overview-of-es6-modules-in-javascript/)

- [ES6 modules support lands in browsers: is it time to rethink bundling?](https://www.contentful.com/blog/2017/04/04/es6-modules-support-lands-in-browsers-is-it-time-to-rethink-bundling/)

- [TypeScript issue#2743: How to use ES6 modules on the browser?](https://github.com/Microsoft/TypeScript/issues/2743)


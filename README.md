ease-scroll
===========

A minimal implementation of smooth scrolling in the browser.

Allows the user to interrupt scrolling.


Usage
-----

```sh
bower install ease-scroll
```

```js
var easeScroll = require('ease-scroll');

document.getElementById('foo').addEventListener('click', function (event) {
  event.preventDefault();
  easeScroll.scrollToElementById('bar', 1000);
});
```

See [ease-scroll-example](https://github.com/mietek/ease-scroll/) for a fully-featured usage example.


License
-------

[MIT X11](https://github.com/mietek/license/blob/master/LICENSE.md) © [Miëtek Bak](http://mietek.io/)

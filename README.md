ease-scroll
===========

Smooth scrolling in the browser.

Allows the user to interrupt scrolling.  Minimal dependencies.

Uses [ease](https://github.com/mietek/ease/) for CSS-style easing.  Used in [cannot](https://github.com/mietek/cannot/).


Usage
-----

```js
var easeScroll = require('ease-scroll');

document.getElementById('foo').addEventListener('click', function (event) {
  event.preventDefault();
  easeScroll.scrollToElementById('bar', 500);
});
```

See [ease-scroll-example](https://github.com/mietek/ease-scroll-example/) for more information.


### Installation

Available as a [Bower](http://bower.io/) package.

```sh
bower install ease-scroll
```


License
-------

[MIT X11](https://github.com/mietek/license/blob/master/LICENSE.md) © [Miëtek Bak](http://mietek.io/)

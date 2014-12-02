_ease-scroll_
=============

Smooth scrolling in the browser, using [_ease_](https://github.com/mietek/ease/) for CSS-style easing.


### Example

```js
var easeScroll = require('ease-scroll');

document.getElementById('foo').addEventListener('click', function (event) {
  event.preventDefault();
  easeScroll.scrollToElementById('bar', 500);
});
```

See [_cannot_](https://cannot.mietek.io/) for more information.


Usage
-----

_ease-scroll_ is installed with [Bower](http://bower.io/).

```
$ bower install ease-scroll
```


About
-----

Made by [Miëtek Bak](https://mietek.io/).  Published under the [MIT X11 license](https://mietek.io/license/).

'use strict';

var ease = require('ease').ease;

/* global innerHeight, requestAnimationFrame, scrollX, scrollY */


(function () {
  var scrolling = false;

  exports.scrollToOffset = function (offset, duration, target) {
    if (scrolling) {
      return;
    }
    if (offset === undefined) {
      throw new Error('missing scroll offset');
    }
    duration = duration || 1000;
    var startY = scrollY;
    var maxY = document.body.scrollHeight - innerHeight;
    var targetY = Math.min(offset, maxY);
    var distance = targetY - startY;
    var startT = Date.now();
    var targetT = startT + duration;
    var onAnimationFrame = function () {
      if (!scrolling) {
        return;
      }
      if (Date.now() >= targetT) {
        scrolling = false;
        scrollTo(scrollX, targetY);
        if (target !== undefined) {
          location.hash = target;
        }
        return;
      }
      var t = (Date.now() - startT) / duration;
      var y = startY + distance * ease(t);
      scrollTo(scrollX, y);
      requestAnimationFrame(onAnimationFrame);
    };
    scrolling = true;
    requestAnimationFrame(onAnimationFrame);
  };

  document.addEventListener('mousewheel', function () {
    scrolling = false;
  });
  // NOTE: This also enables :active pseudo-classes on links in Safari on iOS.
  document.addEventListener('touchstart', function () {
    scrolling = false;
  });
})();


exports.getElementOffsetById = function (id) {
  var target = document.getElementById(id);
  if (!target) {
    return undefined;
  }
  var y = 0;
  do {
    y += target.offsetTop;
    target = target.offsetParent;
  } while (target);
  return y;
};


exports.scrollToElementById = function (id, duration) {
  var offset = exports.getElementOffsetById(id);
  if (offset !== undefined) {
    exports.scrollToOffset(offset, duration, id);
  }
};

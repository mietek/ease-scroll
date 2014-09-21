'use strict';

var ease = require('ease').ease;


(function () {
  var scrolling = false;

  exports.scrollToOffset = function (offset, duration) {
    if (scrolling) {
      return;
    }
    var startY = window.scrollY;
    var maxY = document.body.scrollHeight - window.innerHeight;
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
        window.scrollTo(window.scrollX, targetY);
        return;
      }
      var t = (Date.now() - startT) / duration;
      var y = startY + distance * ease(t);
      window.scrollTo(window.scrollX, y);
      window.requestAnimationFrame(onAnimationFrame);
    };
    scrolling = true;
    window.requestAnimationFrame(onAnimationFrame);
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
    var element = document.getElementById(id);
    var marginTop = parseInt(getComputedStyle(element).marginTop);
    exports.scrollToOffset(offset - marginTop, duration);
  }
};

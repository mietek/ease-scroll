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
})();


exports.scrollToElementById = function (id, duration) {
  var target = document.getElementById(id);
  if (!target) {
    return;
  }
  var y = 0;
  do {
    y += target.offsetTop;
    target = target.offsetParent;
  } while (target);
  exports.scrollToOffset(y, duration);
};

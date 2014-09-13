'use strict';

var ease = require('ease').ease;


exports.getElementOffsetById = function (id) {
  var elem = document.getElementById(id);
  var y = 0;
  do {
    y += elem.offsetTop;
    elem = elem.offsetParent;
  } while (elem);
  return y;
};


(function () {
  var isScrolling = false;

  exports.scrollToOffset = function (offset, duration) {
    if (isScrolling) {
      return;
    }
    var startY = window.scrollY;
    var maxY = document.body.scrollHeight - window.innerHeight;
    var targetY = Math.min(offset, maxY);
    var distance = targetY - startY;
    var startT = Date.now();
    var targetT = startT + duration;
    var loop = function () {
      if (!isScrolling) {
        return;
      }
      var now = Date.now();
      if (now >= targetT) {
        isScrolling = false;
        window.scrollTo(window.scrollX, targetY);
        return;
      }
      var t = (now - startT) / duration;
      var y = startY + distance * ease(t);
      window.scrollTo(window.scrollX, y);
      window.requestAnimationFrame(loop);
    };
    isScrolling = true;
    window.requestAnimationFrame(loop);
  };

  exports.stopScrolling = function () {
    isScrolling = false;
  };
})();


exports.scrollToElementById = function (id, duration) {
  exports.scrollToOffset(exports.getElementOffsetById(id), duration);
};

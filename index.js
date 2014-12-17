'use strict';

var ease = require('ease').ease;

/* global innerHeight, requestAnimationFrame, scrollX, scrollY */


(function () {
  exports.scrollToOffset = function (offset, duration) {
    if (offset === undefined) {
      throw new Error('missing scroll offset');
    }
    if (duration === undefined) {
      duration = 500;
    }
    var startY = scrollY;
    var maxY = document.body.scrollHeight - innerHeight;
    var targetY = Math.max(0, Math.min(offset, maxY));
    var distance = targetY - startY;
    var startT = Date.now();
    var targetT = startT + duration;
    var onAnimationFrame = function () {
      if (Date.now() >= targetT) {
        scrollTo(scrollX, targetY);
        return;
      }
      var t = (Date.now() - startT) / duration;
      var y = startY + distance * ease(t);
      scrollTo(scrollX, y);
      requestAnimationFrame(onAnimationFrame);
    };
    scrollTo(scrollX, startY);
    requestAnimationFrame(onAnimationFrame);
  };

  exports.scrollElementByIdToHorizontalOffset = function (id, offset, duration) {
    var el = document.getElementById(id);
    if (!el) {
      throw new Error('missing element');
    }
    if (offset === undefined) {
      throw new Error('missing scroll offset');
    }
    if (duration === undefined) {
      duration = 500;
    }
    var startX = el.scrollLeft;
    var maxX = el.scrollWidth - el.clientWidth;
    var targetX = Math.max(0, Math.min(offset, maxX));
    var distance = targetX - startX;
    var startT = Date.now();
    var targetT = startT + duration;
    var onAnimationFrame = function () {
      if (Date.now() >= targetT) {
        el.scrollLeft = targetX;
        return;
      }
      var t = (Date.now() - startT) / duration;
      var x = startX + distance * ease(t);
      el.scrollLeft = x;
      requestAnimationFrame(onAnimationFrame);
    };
    requestAnimationFrame(onAnimationFrame);
  };
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
    if (location.hash.slice(1) !== id) {
      history.pushState({ offset: offset, id: id }, '', '#' + id);
    }
    exports.scrollToOffset(offset, duration);
  }
};


exports.applyToLocalLinks = function (duration) {
  if (duration === undefined) {
    duration = 500;
  }
  var links = document.querySelectorAll('a[href^="#"]');
  [].forEach.call(links, function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      exports.scrollToElementById(this.hash.slice(1), duration);
    });
  });
};

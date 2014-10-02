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
    duration = duration || 500;
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

  // NOTE: Inertial scrolling in Safari generates events for longer than expected, preventing new scrolls.  There could be a heuristic — if there were many events prior to a scroll, and there are even more events after the scroll began, then disregard abort?
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


exports.applyToLocalLinks = function (duration, fixLocalBase) {
  duration = duration || 500;
  fixLocalBase = fixLocalBase || true;
  function listener(id) {
    return function (event) {
      event.preventDefault();
      exports.scrollToElementById(id, duration);
    };
  }
  var localBase = location.origin + location.pathname;
  var links = document.links;
  [].forEach.call(links, function (link) {
    var href = link.getAttribute('href');
    if (href[0] === '#') {
      var id = href.slice(1);
      if (fixLocalBase) {
        link.href = localBase + href;
      }
      link.addEventListener('click', listener(id));
    }
  });
};

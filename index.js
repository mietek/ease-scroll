'use strict';

var ease = require('ease').ease;

/* global innerHeight, requestAnimationFrame, scrollX, scrollY */


(function () {
  var scrolling = false;
  var actualScrollY = scrollY;
  var noPopScroll = false;
  var loadTime;

  exports.scrollToOffset = function (offset, duration) {
    if (offset === undefined) {
      throw new Error('missing scroll offset');
    }
    if (duration === undefined) {
      duration = 500;
    }
    var startY = actualScrollY;
    var maxY = document.body.scrollHeight - innerHeight;
    var targetY = Math.max(0, Math.min(offset, maxY));
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
        return;
      }
      var t = (Date.now() - startT) / duration;
      var y = startY + distance * ease(t);
      scrollTo(scrollX, y);
      requestAnimationFrame(onAnimationFrame);
    };
    scrolling = true;
    scrollTo(scrollX, startY);
    requestAnimationFrame(onAnimationFrame);
  };

  var scrollingElements = [];

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
      if (scrollingElements.indexOf(id) === -1) {
        return;
      }
      if (Date.now() >= targetT) {
        delete scrollingElements[id];
        el.scrollLeft = targetX;
        return;
      }
      var t = (Date.now() - startT) / duration;
      var x = startX + distance * ease(t);
      el.scrollLeft = x;
      requestAnimationFrame(onAnimationFrame);
    };
    if (scrollingElements.indexOf(id) === -1) {
      scrollingElements.push(id);
    }
    requestAnimationFrame(onAnimationFrame);
  };

  // NOTE: Keeping track of the actual scroll position is necessary for scrolling smoothly when moving backward or forward through the history.
  addEventListener('load', function () {
    loadTime = Date.now();
    actualScrollY = scrollY;
    history.replaceState({ offset: scrollY }, '', location);
  });
  addEventListener('scroll', function () {
    actualScrollY = scrollY;
  });

  // NOTE: Mixing back/forward commands and gestures gives odd results in Safari 7.1, but works perfectly in Chrome and Firefox.
  addEventListener('popstate', function (event) {
    if (event.state && !noPopScroll && Date.now() >= loadTime + 100) {
      exports.scrollToOffset(event.state.offset);
    }
    noPopScroll = false;
  });

  // NOTE: Inertial scrolling in Safari generates events for longer than expected, preventing new scrolls.  There could be a heuristic — if there were many events prior to a scroll, and there are even more events after the scroll began, then disregard abort?
  document.addEventListener('mousewheel', function () {
    scrolling = false;
    noPopScroll = true;
  });
  addEventListener('mousemove', function () {
    noPopScroll = false;
  });

  // NOTE: This also enables :active pseudo-classes on links in Safari on iOS.
  document.addEventListener('touchstart', function () {
    scrolling = false;
    noPopScroll = true;
  });
  document.addEventListener('touchend', function () {
    noPopScroll = false;
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
    history.pushState({ offset: offset, id: id }, '', '#' + id);
    exports.scrollToOffset(offset, duration);
  }
};


exports.applyToLocalLinks = function (duration, fixLocalBase) {
  if (duration === undefined) {
    duration = 500;
  }
  if (fixLocalBase === undefined) {
    fixLocalBase = true;
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
      link.addEventListener('click', function (event) {
        event.preventDefault();
        exports.scrollToElementById(id, duration);
      });
      link.classList.add('local-link');
    }
  });
};

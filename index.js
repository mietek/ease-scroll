'use strict';

var ease = require('ease').ease;

/* global innerHeight, requestAnimationFrame, scrollX, scrollY */


function tween(startOffset, maxOffset, offset, duration, callback, endCallback) {
  var targetOffset = Math.max(0, Math.min(offset, maxOffset));
  var distance = targetOffset - startOffset;
  var startTime = Date.now();
  var targetTime = startTime + duration;
  var onAnimationFrame = function () {
    if (Date.now() >= targetTime) {
      callback(targetOffset);
      if (endCallback) {
        endCallback();
      }
    } else {
      var t = (Date.now() - startTime) / duration;
      var o = startOffset + distance * ease(t);
      callback(o);
      requestAnimationFrame(onAnimationFrame);
    }
  };
  requestAnimationFrame(onAnimationFrame);
}


(function () {
  exports.scrollToOffset = function (offset, duration, callback) {
    if (offset === undefined) {
      throw new Error('missing scroll offset');
    }
    if (duration === undefined) {
      duration = 500;
    }
    var startOffset = scrollY;
    var maxOffset = document.body.scrollHeight - innerHeight;
    tween(startOffset, maxOffset, offset, duration, function (y) {
      scrollTo(scrollX, y);
    }, callback);
  };

  exports.scrollElementByIdToHorizontalOffset = function (id, offset, duration, callback) {
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
    var startOffset = el.scrollLeft;
    var maxOffset = el.scrollWidth - el.clientWidth;
    tween(startOffset, maxOffset, offset, duration, function (x) {
      el.scrollLeft = x;
    }, callback);
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

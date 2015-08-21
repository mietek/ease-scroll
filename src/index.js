"use strict";

var easeTween = require("ease-tween").easeTween;

var _ = module.exports = {
  easeScroll: function (x, y, duration, callback) {
    var startX = window.scrollX;
    var startY = window.scrollY;
    var distanceX = _.computeDistanceX(x);
    var distanceY = _.computeDistanceY(y);
    easeTween(duration, function (t) {
        window.scroll(
          t * distanceX + startX,
          t * distanceY + startY);
      },
      callback);
  },

  easeScrollX: function (x, duration, callback) {
    var startX = window.scrollX;
    var distanceX = _.computeDistanceX(x);
    easeTween(duration, function (t) {
        window.scroll(
          t * distanceX + startX,
          window.scrollY);
      },
      callback);
  },

  easeScrollY: function (y, duration, callback) {
    var startY = window.scrollY;
    var distanceY = _.computeDistanceY(y);
    easeTween(duration, function (t) {
        window.scroll(
          window.scrollX,
          t * distanceY + startY);
      },
      callback);
  },

  easeScrollElement: function (element, x, y, duration, callback) {
    var startX = element.scrollLeft;
    var startY = element.scrollTop;
    var distanceX = _.computeElementDistanceX(element, x);
    var distanceY = _.computeElementDistanceY(element, y);
    easeTween(duration, function (t) {
        element.scrollLeft = t * distanceX + startX;
        element.scrollTop = t * distanceY + startY;
      },
      callback);
  },

  easeScrollElementX: function (element, x, duration, callback) {
    var startX = element.scrollLeft;
    var distanceX = _.computeElementDistanceX(element, x);
    easeTween(duration, function (t) {
        element.scrollLeft = t * distanceX + startX;
      },
      callback);
  },

  easeScrollElementY: function (element, y, duration, callback) {
    var startY = element.scrollTop;
    var distanceY = _.computeElementDistanceY(element, y);
    easeTween(duration, function (t) {
        element.scrollTop = t * distanceY + startY;
      },
      callback);
  },

  computeDistanceX: function (x) {
    return (
      _.computeGenericDistance(x,
        document.body.scrollWidth,
        window.innerWidth,
        window.scrollX));
  },

  computeDistanceY: function (y) {
    return (
      _.computeGenericDistance(y,
        document.body.scrollHeight,
        window.innerHeight,
        window.scrollY));
  },

  computeElementDistanceX: function (element, x) {
    return (
      _.computeGenericDistance(x,
        element.scrollWidth,
        element.clientWidth,
        element.scrollLeft));
  },

  computeElementDistanceY: function (element, y) {
    return (
      _.computeGenericDistance(y,
        element.scrollHeight,
        element.clientHeight,
        element.scrollTop));
  },

  computeGenericDistance: function (z, scrollSize, clientSize, startZ) {
    return (
      Math.max(0,
        Math.min(z,
          scrollSize - clientSize)) - startZ);
  }
};

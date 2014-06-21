/*!
 * url-dom
 * Copyright (c) 2013 Daniel Yang <miniflycn@justany.net>
 * Copyright (c) 2014 QQEDU TEAM
 * MIT Licensed
 */
module.exports = (function () {
  "use strict";
  var spawn = require('child_process').spawn
    , EventEmitter = require('events').EventEmitter
    , util = require('util')
    , cheerio = require('cheerio');

  /** 
   * DOM
   * @param {String} url
   */
  function DOM(url) {
    if (!(this instanceof DOM)) return new DOM(url);
    EventEmitter.call(this);
    var init = this.init.bind(this);
    process.nextTick(function () {
      init(url);
    });
  }
  util.inherits(DOM, EventEmitter);
  DOM.prototype.init = function (url) {
    var worker = spawn('phantomjs', [__dirname + '/fetch.js'].concat(url))
      , that = this
      , buffers = [];
    worker.stdout.on('data', function (buffer) {
      buffers.push(buffer);
    });
    worker.stdout.on('end', function () {
      var result = Buffer.concat(buffers);
      that.emit('done', cheerio.load(result.toString()));
    });
    worker.stderr.on('data', function (data) {
      that.emit('fail', data.toString());
    });
    worker.on('close', function (code) {
      that.emit('close', code);
    });
    return this;
  };
  /** 
   * success
   * @param {Function} cb
   */
  DOM.prototype.success = function (cb) {
    this.on('done', cb);
    return this;
  };
  /**
   * fail
   * @param {Function} cb
   */
  DOM.prototype.fail = function (cb) {
    this.on('fail', cb);
    return this;
  };

  return DOM;
})();
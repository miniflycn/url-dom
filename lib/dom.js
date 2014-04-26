/*!
 * url-dom
 * Copyright (c) 2013 Daniel Yang <miniflycn@justany.net>
 * Copyright (c) 2014 QQEDU TEAM
 * MIT Licensed
 */
module.exports = (function () {
  "use strict";
  var spawn = require('child_process').spawn
    , cheerio = require('cheerio')
    , noop = function () {};

  function DOM(url) {
    var init = this.init.bind(this);
    process.nextTick(function () {
      init(url);
    });
  }
  DOM.prototype = {
    constructor: DOM,
    init: function (url) {
      var worker = spawn('phantomjs', [__dirname + '/fetch.js'].concat(url))
        , that = this
        , buffers = [];
      worker.stdout.on('data', function (buffer) {
        buffers.push(buffer);
      });
      worker.stdout.on('end', function () {
        var result = Buffer.concat(buffers);
        that.onsuccess(cheerio.load(result.toString()));
      });
      worker.stderr.on('data', function (data) {
        // console.log('PhantomJS worker has occur a error: ' + data);
        that.onfail(data.toString());
      });
      worker.on('close', function (code) {
        // worker close
      });
      return this;
    },
    success: function (cb) {
      this.onsuccess = cb;
      return this;
    },
    fail: function (cb) {
      this.onfail = cb;
      return this;
    },
    onsuccess: noop,
    onfail: noop
  }

  return function (url) {
    return (new DOM(url));
  };

})();
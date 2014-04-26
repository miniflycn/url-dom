!function () { 
  var dom = require('../');

  dom('http://ke.qq.com')
    .success(function ($) {
      console.log($('title').html())
    });
}();
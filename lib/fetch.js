/*!
 * url-dom
 * Copyright (c) 2013 Daniel Yang <miniflycn@justany.net>
 * Copyright (c) 2014 QQEDU TEAM
 * MIT Licensed
 */
var webpage = require('webpage')
  , write = require('system').stdout.write
  , error = require('system').stderr.write
  , ads = require('system').args.slice(1);

function begin() {
  return fetch(ads.shift());
}
begin();

function fetch(url) {
  if (!/^https?:\/\//.test(url)) return error('URL is wrong!');
  var page = webpage.create();

  page.open(url, function (status) {
    if (status !== 'success') {
      error('FAIL to load the url: ' + url);
    } else {
      write(page.content);
    }
    page.close();
    
    phantom.exit();
  });
}
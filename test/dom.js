var dom = require('../lib/dom')
  , connect = require('connect');

var testServer = connect()
                  .use('/test', function (req, res, next) {
                    res.writeHead(200, {
                      'Content-Type': 'text/html; charset=UTF-8'
                    });
                    res.statusCode = 200;
                    res.end('<html><head><title>test</title></head><body>hello world!</body></html>');
                  })
                  .listen(7777);

describe('dom', function () {
  it('should able to get a cheerio instance', function (done) {
    dom('http://127.0.0.1:7777/test').success(function ($) {
      $().cheerio.should.equal('[cheerio object]');
      done();
    });
  });

  it('should able to get the title and body', function (done) {
    dom('http://127.0.0.1:7777/test').success(function ($) {
      $('title').html().should.equal('test');
      $('body').html().should.equal('hello world!');
      done();
    });
  });
});
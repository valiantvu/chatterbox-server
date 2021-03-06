/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var fs = require('fs');
var obj = {};
obj.results = JSON.parse(fs.readFileSync('messages.txt')).results;

exports.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";//******changed from plain text to json
  var statusCode;
  var urlArray = request.url.split('/');

  if (request.method == "GET" && urlArray[1] === 'classes') {

    statusCode = 200;
    response.writeHead(statusCode, headers);
    var readMessages = fs.readFileSync('messages.txt');
    response.end(JSON.stringify(JSON.parse(readMessages)));

  } else if(request.method == "POST" && urlArray[1] === 'classes') {

    request.on('data', function(chunk){
      statusCode = 201;
      response.writeHead(statusCode, headers);
      obj.results.unshift(JSON.parse(chunk));
      var msg = JSON.stringify(obj);
      fs.writeFileSync('messages.txt', msg);
      response.end(msg);
    });

  } else if ( request.method == "OPTIONS") {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
  } else {

    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end("yolo");

  }
  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

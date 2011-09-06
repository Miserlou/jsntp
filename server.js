function ntplisten(app) {
  var io = require('socket.io').listen(app)
    , fs = require('fs')
    , path = require('path')

  var WEBDIR='/ntp/'
    , SRVDIR='client/'
    , CLIENT='ntp.js'

  var ERROR='Welcome to NTP.js'

  function handler (request,response) {
    //If the ntp directory is requested, do something
    if (request.url.split('/')[1]===DIR){
      if (request.url===DIR+CLIENT) {
        var filePath = SRVDIR+CLIENT;
        fs.readFile(filePath, function(error, content) {
  	if (error) {
  	  response.writeHead(500);
  	  response.end();
  	} else {
  	  response.writeHead(200, {'Content-Type':'text/javascript'});
  	  response.end(content, 'utf-8');
  	}
        });
      } else {
        response.writeHead(500);
        response.end(ERROR);
      }
    }
  }

  io.sockets.on('connection', function (socket) {
    socket.on('message', function (clientTime) {
      socket.send(new Date().getTime()+':'+clientTime);
    });
  });
}

//Calling this library
var app = require('http').createServer(handler)
app.listen(8000);
ntplisten(app)

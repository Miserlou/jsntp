ntp={
  'WEBDIR':'ntp'
, 'SRVDIR':'client'
, 'JS':{
    'ntp.js':1
  , 'at.js':1
  }

, 'listen':function (app) {
    this.io = require('socket.io').listen(app);
    this.fs = require('fs');
    this.path = require('path');

    this.io.sockets.on('connection', function (socket) {
      socket.on('message', function (clientTime) {
        socket.send(new Date().getTime()+':'+clientTime);
      });
    });
  }

, 'client':function (request,response) {
      //If the ntp directory is requested, do something
      var clientPath=request.url.split('/');
      if (clientPath[1]===this.WEBDIR){
        var JS=clientPath[2];
        if (JS in this.JS) {
          var filePath = './'+this.SRVDIR+'/'+JS;
          this.fs.readFile(filePath, function(error, content) {
            if (error) {
              response.writeHead(500);
              response.end('Oops. The ntp.js installation is apparently messed up.');
            } else {
              response.writeHead(200, {'Content-Type':'text/javascript'});
              response.end(content, 'utf-8');
            }
          });
        } else {
          response.writeHead(500);
          response.end('Welcome to ntp.js');
        }
      }
    }

}

//Calling this library

function handler (request,response) {
  ntp.client(request,response) //Listen for the call to the ntp javascript

  /* Your code goes here
     In this case, we're just loading the demo.
  */
  require('fs').readFile('demo.html', function(error, content) {
    if (error) {
      response.writeHead(500);
      response.end();
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(content, 'utf-8');
    }
  });
  /* End of your code
     ...
  */
}

//If you're not serving anything of your own on this server, you can do
//var app = require('http').createServer(ntp.client) 

var app = require('http').createServer(handler) 
app.listen(8000);
ntp.listen(app);

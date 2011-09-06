module.exports={
  'WEBDIR':'ntp'
, 'SRVDIR': './node_modules/ntp/static'
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

, 'static':function (request,response) {
      //If the ntp directory is requested, do something
      var clientPath=request.url.split('/');
      if (clientPath[1]===this.WEBDIR){
        var JS=clientPath[2];
        if (JS in this.JS) {
          var filePath = this.SRVDIR+'/'+JS;
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


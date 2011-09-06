
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  ,  path = require('path')


app.listen(8000);

function handler (request,response) {
	console.log('request starting...');

	var filePath = '.' + request.url;
	if (filePath == './')
		filePath = './index.html';
		
	var extname = path.extname(filePath);
	var contentType = 'text/html';
	switch (extname) {
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.ogg':
			contentType = 'application/ogg';
			break;
	}

	path.exists(filePath, function(exists) {

		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					response.writeHead(500);
					response.end();
				}
				else {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				}
			});
		}
		else {
			response.writeHead(404);
			response.end();
		}
	});
}

io.sockets.on('connection', function (socket) {
/*
  console.log('Server time:');
  console.log(new Date().getTime());
  socket.on('ferret', function (name, fn) {
    fn('woot');
  });
*/
  socket.on('message', function (clientTime) {
    socket.send(new Date().getTime()+':'+clientTime);
  });
});

/*
   Demo of ntpjs and at.js: Server

   Copyright 2011, Thomas Levine
*/

ntp=require('ntp');

function handler (request,response) {
  //Listen for the call to the ntp javascript
  ntp.static(request,response)

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
//var app = require('http').createServer(ntp.static)

var app = require('http').createServer(handler) 
app.listen(8000);
ntp.listen(app);

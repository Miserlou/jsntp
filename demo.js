/*
   Demo of ntpjs and at.js: Server

   By Thomas Levine

   To the extent possible under law, Thomas Levine waives
   all copyright and related or neighboring rights to the
   demo of ntpjs and at.js in this file. This work is
   published from the United States.
*/

ntp=require('ntp');
var app = require('http').createServer(handler) 
function handler(request,response){
  ntp.static(request,response,servepage);
};
app.listen(8000);
ntp.listen(app);

function servepage (request,response) {
  require('fs').readFile('demo.html', function(error, content) {
    if (error) {
      response.writeHead(500);
      response.end();
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(content, 'utf-8');
    }
  });
}

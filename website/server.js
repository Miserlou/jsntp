ntp=require('ntp');
var app = require('http').createServer(handler) 
app.listen(8080);
ntp.listen(app);

var file = new(static.Server)('./public');

function handler (request,response) {
  //Listen for the call to the ntp javascript
  ntp.static(request,response)
  /*
     Host the current folder statically
  */
  request.addListener('end', function () {
    file.serve(request, response);
  });
}

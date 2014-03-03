var http = require("http"), url = require("url"), qs = require("querystring"), mysql = require("mysql"), fs = require("fs");

function gpRequest(request, response, callback){
	var gpData='';
	if(typeof callback !== 'function') return null;
		
	if(request.method == 'GET'){
		var _get = url.parse(request.url, true).query;
		response.writeHead(200, {"Content-Type": "text/plain"});
		if(_get.callback){
			fs.readFile("test.txt", 'utf-8', function (error, data) {
				response.end(_get.callback+"("+data+")");
			});
		}
		else{response.end()}
		/*fs.readFile("test.txt", 'utf-8', function (error, data) {
			response.end(_get.callback+"("+data+")");
		});*/
	}
	else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

http.createServer(function (request, response) {
	gpRequest(request, response, function(callback){
	});
}).listen(8080);
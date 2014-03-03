var http = require("http"), url = require("url"), qs = require("querystring"), mysql = require("mysql"), fs = require("fs"), rtn=null;

function gpRequest(request, response, callback){
	var gpData='';
	if(typeof callback !== 'function') return null;
		
	if(request.method == 'GET'){
		var _get = url.parse(request.url, true).query, rtn;
		response.writeHead(200, {"Content-Type": "text/plain"});
		rtn = callback(_get);
		if(_get.callback){
			response.end(_get.callback+"("+rtn+")");
		}
		else{response.end()}
	}
	else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

http.createServer(function (request, response) {
	gpRequest(request, response, function(data){
		console.log(data);
		return "{'k1':'v1','k2':'v2','k3':'v3','k4':'v4'}"
	});
}).listen(8080);
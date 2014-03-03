var http = require("http");
var url = require("url");
var qs = require("querystring");
var mysql = require("mysql");
var fs = require("fs");

function gpRequest(request, response, callback){
	var gpData='';
	if(typeof callback !== 'function') return null;
	
	if(request.method == 'POST'){
		request.on('data', function(data){
			gpData+=data;
			if(gpData.length > 1e6) {
                gpData = "";
                response.writeHead(413, {"Content-Type": "application/x-www-form-urlencoded"});
                request.connection.destroy();
            }
		});
		request.on('end', function() {
            response.post = qs.parse(gpData);
			response.writeHead(200, "OK", {"Content-Type": "text/plain"});
			callback(response.post);
			//response.end('Data sent using "POST": '+gpData);
			response.end('Error has been logged successfully');
        });
	}
	else if(request.method == 'GET'){
		var _get = url.parse(request.url, true).query;
      	response.writeHead(200, {"Content-Type": "application/x-www-form-urlencoded"});
		callback(_get);
      	//response.end('Data sent using "GET": ' + _get['loggedErrors']);
		response.end('Error has been logged successfully');
	}
	else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

http.createServer(function (request, response) {
		var connection = mysql.createConnection({
		   user: "root",
		   password: "",
		   //database: "errorlogging"
		});
		gpRequest(request, response, function(dta) {
			var _date=new Date();
			//connection.query('use errorlogging');
			//connection.query('INSERT INTO logs '+'SET ID = ?, DATE = ?, STR = ?',['NULL', _date, dta['loggedErrors']]);
			fs.readFile("test.txt", 'utf-8', function (error, data) {
				//data += dta['loggedErrors']+'\n\n';
				//data += dta;
				fs.writeFile('test.txt', JSON.stringify(dta));
			});
		});
	}).listen(8080);
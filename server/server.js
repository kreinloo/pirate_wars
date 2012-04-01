/*

	server.js

*/

// required node modules
var io = require("socket.io").listen(8001);
var node_static = require("node-static");
var http = require("http");
var util = require("util");

// our gameserver
var pw_server = require("pw_server");

pw_server.setIO(io);
pw_server.bindListeners(io);

// static file server
var file = new (node_static.Server)("../client");
http.createServer(function (request, response) {
	request.addListener("end", function () {
		file.serve(request, response);
	});
}).listen(8000);

/*

	server.js

*/

// required node modules
var io = require("socket.io").listen(8001);
var node_static = require("node-static");
var http = require("http");
var util = require("util");

// our application modules and variables
var serverClient = require("./serverclient");
var events = require("../client/js/events");

// server holds hash of connected users, don't know if necessary
// values are stored like this: key : 'full name' => value : socket
var clients = {};

io.sockets.on("connection", function (socket) {

	socket.on(CLIENT.AUTH, function (data) {

		if (typeof data === "undefined")
			return;

		socket.set("client", new ServerClient(data.id));
		util.log(CLIENT.AUTH + " " + JSON.stringify(data));

		socket.get("client", function (err, client) {
			clients[client.getName()] = socket;
			socket.broadcast.emit(SERVER.USER_CONNECTED, {
				name : client.getName()
			})
		});

		socket.emit(CHAT.USER_LIST, { users: Object.keys(clients) });

	});

	socket.on(CHAT.PUBLIC_MESSAGE, function (data) {

		if (typeof data === "undefined")
			return;

		util.log(CHAT.PUBLIC_MESSAGE + " " + JSON.stringify(data));
		socket.broadcast.emit(CHAT.PUBLIC_MESSAGE, data);

	});

	socket.on(CHAT.USER_LIST, function () {
		socket.emit(CHAT.USER_LIST, { users: Object.keys(clients) });
	})

	socket.on(GAME.CREATE_GAME, function (data) {
		util.log(GAME.CREATE_GAME + " " + JSON.stringify(data));
		socket.broadcast.emit(GAME.CREATE_GAME, data);
	});

	socket.on(GAME.DELETE_GAME, function (data) {
		util.log(GAME.DELETE_GAME + " " + JSON.stringify(data));
		socket.broadcast.emit(GAME.DELETE_GAME, data);
	});

	socket.on(GAME.JOIN_GAME, function (data) {

		util.log(GAME.JOIN_GAME + " " + JSON.stringify(data));
		var creator = data.creator;
		var creatorSocket = clients[creator];
		creatorSocket.broadcast.emit(GAME.DELETE_GAME, { name: creator });
		// TODO!
		// create new game, etc

	});

	socket.on("disconnect", function () {

		socket.get("client", function (err, client) {
			delete clients[client.getName()];
			socket.broadcast.emit(SERVER.USER_DISCONNECTED, {
				name : client.getName()
			})
		});

	});

});

// static file server
var file = new (node_static.Server)("../client");
http.createServer(function (request, response) {
	request.addListener("end", function () {
		file.serve(request, response);
	})
}).listen(8000);

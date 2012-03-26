/*

	server.js

*/

var io = require("socket.io").listen(8001);
var serverClient = require("./serverclient");
var events = require("../client/js/events");

var clients = {};

io.sockets.on("connection", function (socket) {

	socket.emit(SERVER.STATUS, { msg: "connection established" });

	socket.on(CHAT.PUBLIC_MESSAGE, function (data) {

		if (typeof data === "undefined")
			return;
		console.log("received public chat message: " +
			data.author + ": " + data.msg);
		socket.broadcast.emit(CHAT.PUBLIC_MESSAGE, data);

	});

	socket.on(CHAT.USER_LIST, function () {
		socket.emit(CHAT.USER_LIST, Object.keys(clients));
	})

	socket.on(CLIENT.AUTH, function (data) {

		if (typeof data === "undefined")
			return;

		socket.set("client", new ServerClient(data.id));
		console.log("new client: " + data.id);

		socket.get("client", function (err, client) {
			clientName = client.getName();
			clients.clientName = socket;
			socket.broadcast.emit(CHAT.USER_CONNECTED, {
				name : clientName
			})
		});

	});

	socket.on("disconnect", function () {

		socket.get("client", function (err, client) {
			clientName = client.getName();
			delete clients.clientName;
			socket.broadcast.emit(CHAT.USER_DISCONNECTED, {
				name : clientName
			})
		});

	});

});

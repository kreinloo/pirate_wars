/*

	gameserver.js

*/

var util = require("util");
require("./serverclient");
require("../client/js/events");

/*
	GameServer
*/
var GameServer = function () {

	var io = null;
	var clients = {};

	var userConnectHandler = function (data, socket) {

		if (typeof data === undefined)
			return;

		data.socket = socket;
		client = new ServerClient(data);
		clients[client.getID()] = client;
		socket.set("clientID", client.getID());
		socket.broadcast.emit(SERVER.USER_CONNECTED, {
			name : client.getName(),
			id : client.getID()
		});
		userListHandler({}, socket);

	};

	var userDisconnectHandler = function (socket) {

		socket.get("clientID", function(err, id) {
			client = clients[id];
			delete clients[id];
			socket.broadcast.emit(SERVER.USER_DISCONNECTED, {
				name : client.getName(),
				id : client.getID()
			});
		});

	};

	var publicMessageHandler = function (data, socket) {

		if (typeof data === "undefined")
			return;
		socket.broadcast.emit(CHAT.PUBLIC_MESSAGE, data);

	};

	var userListHandler = function (data, socket) {

		var list = [];
		for (var c in clients) {
			client = clients[c];
			list.push({ name : client.getName(), id : client.getID() });
		}
		socket.emit(CHAT.USER_LIST, list);

	};

	var createGameHandler = function (data, socket) {

		socket.broadcast.emit(GAME.CREATE_GAME, data);

	};

	var deleteGameHandler = function (data, socket) {

		socket.broadcast.emit(GAME.DELETE_GAME, data);

	};

	var joinGameHandler = function (data, socket) {

		var creator = clients[data.opponentID];
		var creatorSocket = creator.getSocket();
		deleteGameHandler({ name : data.opponentName, id : data.opponentID }, creatorSocket);
		// TODO:

	};

	var bindListeners = function () {

		io.sockets.on("connection", function(socket) {

			socket.on(CLIENT.AUTH, function (data) {
				util.log(CLIENT.AUTH + " " + JSON.stringify(data));
				userConnectHandler(data, socket);
			});

			socket.on(CHAT.PUBLIC_MESSAGE, function (data) {
				util.log(CHAT.PUBLIC_MESSAGE + " " + JSON.stringify(data));
				publicMessageHandler(data, socket);
			});

			socket.on(CHAT.USER_LIST, function (data) {
				util.log(CHAT.USER_LIST + " " + JSON.stringify(data));
				userListHandler(data, socket);
			});

			socket.on(GAME.CREATE_GAME, function (data) {
				util.log(GAME.CREATE_GAME + " " + JSON.stringify(data));
				createGameHandler(data, socket);
			});

			socket.on(GAME.DELETE_GAME, function (data) {
				util.log(GAME.DELETE_GAME + " " + JSON.stringify(data));
				deleteGameHandler(data, socket);
			});

			socket.on(GAME.JOIN_GAME, function (data) {
				util.log(GAME.JOIN_GAME + " " + JSON.stringify(data));
				joinGameHandler(data, socket);
			});

			socket.on("disconnect", function () {
				util.log("DISCONNECT");
				userDisconnectHandler(socket);
			});

		});

	};

	var setIO = function (IO) { io = IO; };

	return {
		setIO : setIO,
		bindListeners : bindListeners
	};

};

module.exports = new GameServer();

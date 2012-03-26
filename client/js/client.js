/*

	client.js

*/

var Client = (function () {

	var id = null;
	var name = null;
	var socket = null;
	var player = null;

	var connect = function (params) {

		if (typeof params === "undefined") {
			params = {};
			params.host = "localhost";
			params.port = 8001;
		}

		socket = io.connect("http://" + params.host + ":" + params.port);
		socket.emit(CLIENT.AUTH, { id : id});
		addSocketListeners();
		console.log("client: connected!");

	};

	var emit = function (event, data) {
		socket.emit(event, data);
	};

	var setID = function (nid) {
		id = nid;
		name = nid;
	};

	var getName = function () {
		return name;
	};

	var sendPublicMessage = function (message) {
		socket.emit(CHAT.PUBLIC_MESSAGE, {
			name: id,
			msg: message
		});
	};

	var addSocketListeners = function () {

		socket.on(SERVER.STATUS, function (data) {
			if (typeof data === "undefined")
				return;
			console.log("server msg: " + data.msg);
		});

		socket.on(CHAT.PUBLIC_MESSAGE, function (data) {
			if (typeof data === "undefined")
				return;
			Lobby.addPublicMessage(data);
			console.log("received public message: " + JSON.stringify(data));
		});

		socket.on(CHAT.USER_LIST, function (data) {
			if (typeof data === "undefined")
				return;

			console.log("received user list");
			console.log(data);
		});

		socket.on(CHAT.USER_CONNECTED, function (data) {
			console.log("user connected: " + data.name);
		});

		socket.on(CHAT.USER_DISCONNECTED, function (data) {
			console.log("user disconnected: " + data.name);
		});

	};

	return {
		connect : connect,
		emit : emit,
		setID : setID,
		sendPublicMessage : sendPublicMessage,
		getName : getName
	}

})();

/*

	client.js

*/

/*
	Client object should be responsible for communicating with server.
*/
Client = (function () {

	var id = null;
	var name = null;
	var socket = null;
	var player = null;
	var gameStatus = GAME.STATUS.IDLE;

	/*
		Connects to the server.
	*/
	var connect = function (params) {

		if (typeof params === "undefined") {
			params = {};
			params.host = "localhost";
			params.port = 8001;
		}

		socket = io.connect("http://" + params.host + ":" + params.port);
		socket.emit(CLIENT.AUTH, { id : id, name : name });
		addSocketListeners();
		console.log("client: connected!");

	};

	/*
		Emits custom event to the server. Can be used for debugging.
	*/
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

	/*
		Sends public message to the server. It will be displayed in the
		game lobby log.
	*/
	var sendPublicMessage = function (message) {
		socket.emit(CHAT.PUBLIC_MESSAGE, {
			author: name,
			msg: message
		});
	};

	/*
		Adds different listeners to the events which server sends to the client.
	*/
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
			console.log("recv public message: " + JSON.stringify(data));
		});

		socket.on(CHAT.USER_LIST, function (data) {
			if (typeof data === "undefined")
				return;
			console.log("recv user list: " + JSON.stringify(data));
			Lobby.updateUserList(data);
		});

		socket.on(SERVER.USER_CONNECTED, function (data) {
			console.log("user connected: " + JSON.stringify(data));
			Lobby.addConnectedUser(data);
		});

		socket.on(SERVER.USER_DISCONNECTED, function (data) {
			console.log("user disconnected: " + JSON.stringify(data));
			Lobby.removeDisconnectedUser(data);
		});

		socket.on(GAME.CREATE_GAME, function (data) {
			console.log(GAME.CREATE_GAME + " " + JSON.stringify(data));
			Lobby.addNewGame(data);
		});

		socket.on(GAME.DELETE_GAME, function (data) {
			console.log(GAME.DELETE_GAME + " " + JSON.stringify(data));
			Lobby.deleteGame(data);
		});

		socket.on(GAME.START, function (data) {
			console.log(GAME.START + " " + JSON.stringify(data));
		});

	};

	/*
		Notifies server that this client has created new game
		and not waits for opponent.
	*/
	var createGame = function () {

		if (gameStatus === GAME.STATUS.IDLE) {
			socket.emit(GAME.CREATE_GAME, { name : name });
			gameStatus = GAME.STATUS.WAITING;
			console.log("game created, waiting for opponent ...");
			return true;
		} else {
			return false;
		}

	};

	/*
		Notifies server that this client no more waits for opponent.
	*/
	var deleteGame = function () {

		if (gameStatus === GAME.STATUS.WAITING) {
			socket.emit(GAME.DELETE_GAME, { name : name });
			gameStatus = GAME.STATUS.IDLE;
			console.log("game deleted");
			return true;
		} else {
			return false;
		}

	};

	/*
		Notifies server that this client wishes to play with 'opponent'.
	*/
	var joinGame = function (opponent) {
		data = {};
		data.creator = opponent;
		data.joiner = name
		socket.emit(GAME.JOIN_GAME, data);
		gameStatus = GAME.STATUS.PLAYING;
		console.log("joining game, opponent: " + opponent);
	};

	return {
		connect : connect,
		emit : emit,
		setID : setID,
		sendPublicMessage : sendPublicMessage,
		getName : getName,
		createGame : createGame,
		deleteGame : deleteGame,
		joinGame : joinGame
	}

})();

/*

	client.js

*/

/*
	Client object should be responsible for communicating with server.
*/
var Client = (function () {

	"use strict";

	var id = null;
	var name = null;
	var socket = null;
	var player = null;
	var gameStatus = GAME.STATUS.IDLE;
	var serverInterface = new ServerInterface ();

	var lobby = new Lobby ();

	/*
		Connects to the server.
	*/
	var connect = function (params) {

		if (typeof params === "undefined") {
			params = {};
			params.host = "localhost";
			params.port = 8001;
		}

		var options = {};
		// for deployment at heroku
		//options["transports"] = ["xhr-polling"];

		socket = io.connect("http://" + params.host + ":" + params.port, options);
		socket.emit(CLIENT.AUTH, { id : id, name : name });
		addSocketListeners();
		console.log(CLIENT.AUTH + " " + JSON.stringify({ id : id, name : name }));

	};

	/*
		Emits custom event to the server. Can be used for debugging.
		ServerInterface uses it to send GAME.INFO events.
	*/
	var emit = function (event, data) {
		socket.emit(event, data);
	};

	var setID = function (nid) {
		id = nid;
		name = nid;
	};

	var getID = function () {
		return id;
	};

	var getName = function () {
		return name;
	};

	/*
		Sends public message to the server. It will be displayed in the
		game lobby log.
	*/
	var sendPublicMessage = function (message) {
		socket.emit(CHAT.PUBLIC_MESSAGE,
			{
				author: name,
				msg: message
			});
	};

	/*
		Adds different listeners to the events which server sends to the client.
	*/
	var addSocketListeners = function () {

		// general info from server
		socket.on(SERVER.STATUS, function (data) {
			if (typeof data === "undefined")
				return;
			console.log("server msg: " + data.msg);
		});

		// server sends a public message
		socket.on(CHAT.PUBLIC_MESSAGE, function (data) {
			if (typeof data === "undefined")
				return;
			lobby.addPublicMessage(data);
			console.log(CHAT.PUBLIC_MESSAGE + " " + JSON.stringify(data));
		});

		// server sends a initial userlist on connection
		socket.on(CHAT.USER_LIST, function (data) {
			if (typeof data === "undefined")
				return;
			console.log(CHAT.USER_LIST + " " + JSON.stringify(data));
			lobby.updateUserList(data);
		});

		// server notifies about new connected user
		socket.on(SERVER.USER_CONNECTED, function (data) {
			console.log(SERVER.USER_CONNECTED + " " + JSON.stringify(data));
			lobby.addConnectedUser(data);
		});

		// server notifies about disconnected user
		socket.on(SERVER.USER_DISCONNECTED, function (data) {
			console.log(SERVER.USER_DISCONNECTED + " " + JSON.stringify(data));
			lobby.removeDisconnectedUser(data);
		});

		// server notifies about a new created game by some other player
		socket.on(GAME.CREATE, function (data) {
			console.log(GAME.CREATE + " " + JSON.stringify(data));
			lobby.addNewGame(data);
		});

		// server notifies about a deleted game from public user list
		socket.on(GAME.DELETE, function (data) {
			console.log(GAME.DELETE + " " + JSON.stringify(data));
			lobby.deleteGame(data);
		});

		// server notifies that somebody whishes to play with this player
		socket.on(GAME.JOIN_REQUEST, function (data) {
			console.log(GAME.JOIN_REQUEST + " " + JSON.stringify(data));
		});

		// server notifies that this player is starting a new game
		socket.on(GAME.START, function (data) {
			console.log(GAME.START + " " + JSON.stringify(data));
			serverInterface.startGame(data);
			serverInterface.setPlayer(new Player(serverInterface));
			serverInterface.setClient(Client);
			PirateWars.loadGameView();
			Game.setPlayer(serverInterface.getPlayer());
			Game.initialize();
		});

		// general info regarding current game
		socket.on(GAME.INFO, function (data) {
			console.log(GAME.INFO + " " + JSON.stringify(data));
			serverInterface.call(data);
		});

	};

	/*
		Notifies server that this client has created new game
		and not waits for opponent.
	*/
	var createGame = function () {

		if (gameStatus === GAME.STATUS.IDLE) {
			socket.emit(GAME.CREATE, { name : name, id : id });
			gameStatus = GAME.STATUS.WAITING;
			console.log(GAME.CREATE + " " + JSON.stringify({ name : name, id : id }));
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
			socket.emit(GAME.DELETE, { name : name, id : id });
			gameStatus = GAME.STATUS.IDLE;
			console.log(GAME.DELETE + " " + JSON.stringify({ name : name, id : id }));
			return true;
		} else {
			return false;
		}

	};

	/*
		Notifies server that this client wishes to play with 'opponent'.
	*/
	var joinGame = function (data) {

		data.joinerID = id;
		data.joinerName = name;
		socket.emit(GAME.JOIN_REQUEST, data);
		console.log(GAME.JOIN_REQUEST + " " + JSON.stringify(data));

	};

	return {

		connect : connect,
		emit : emit,
		setID : setID,
		getID : getID,
		getName : getName,
		sendPublicMessage : sendPublicMessage,
		createGame : createGame,
		deleteGame : deleteGame,
		joinGame : joinGame

	};

})();

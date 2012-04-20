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
	var scoreboardSocket = null;
	var serverInterface = null;
	var replayManager = null;
	var gameStatus = GAME.STATUS.IDLE;

	// Server parameters
	var options = null;
	var params = null;

	/*
		Initializes those parameters.
	*/
	var initParams = function () {
		this.params = {};
		this.params.host = "localhost";
		this.params.port = 8001;
		// for deployment at heroku
		//this.options = {};
		//this.options["transports"] = ["xhr-polling"];
	};

	/*
		Connects to the server.
	*/
	var connect = function (_id_, params) {
		id = _id_;
		name = _id_;
		if (socket == null) {
			socket = io.connect("http://" + this.params.host + ":" + this.params.port, this.options);
			addSocketListeners();
		}

		socket.emit(CLIENT.AUTH, { id : id, name : name });
	};

	/*
		Methods to join/leave scoreboard namespace.
		Receives live score updates from server.
	*/

	var joinScoreboard = function () {
		console.log("Joining Scoreboard namespace!");
		this.scoreboardSocket = io.connect(
			"http://" + this.params.host + ":" + this.params.port + "/scoreboard",
			this.options
		);
		// Bind it, bind it!
		// Scoreboard data (broadcast)
		this.scoreboardSocket.on(SCOREBOARD.DATA, function (data) {
			console.log(SCOREBOARD.DATA + " (broadcast) " + JSON.stringify(data));
			ui.scoreboard.refreshData(data);
		});
	};

	var leaveScoreboard = function () {
		if (this.scoreboardSocket != null) {
			console.log("Leaving Scoreboard namespace!");
			this.scoreboardSocket.disconnect();

			// https://github.com/LearnBoost/socket.io-client/issues/251
			delete io.sockets["http://" + this.params.host + ":" + this.params.port];
			io.j = [];
		}
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

		// client auth try
		socket.on(CLIENT.AUTH, function (data) {
			if (typeof data === "undefined")
				return;
			console.log(CLIENT.AUTH + " " + JSON.stringify(data));

			if (data.error == true) {
				ui.dialog("custom", {
					title : "Login",
					msg: data.errorMsg
				});
			}
			else {
				id = data.id;
				name = data.name;
				ui.load("lobby");
				replayManager = new ReplayManager(id);
			}
		});

		// server sends a public message
		socket.on(CHAT.PUBLIC_MESSAGE, function (data) {
			if (typeof data === "undefined")
				return;
			ui.lobby.addPublicMessage(data);
			console.log(CHAT.PUBLIC_MESSAGE + " " + JSON.stringify(data));
		});

		// server sends a initial userlist on connection
		socket.on(CHAT.USER_LIST, function (data) {
			if (typeof data === "undefined")
				return;
			console.log(CHAT.USER_LIST + " " + JSON.stringify(data));
			ui.lobby.updateUserList(data);
		});

		// server notifies about new connected user
		socket.on(SERVER.USER_CONNECTED, function (data) {
			console.log(SERVER.USER_CONNECTED + " " + JSON.stringify(data));
			ui.lobby.addConnectedUser(data);
		});

		// server notifies about disconnected user
		socket.on(SERVER.USER_DISCONNECTED, function (data) {
			console.log(SERVER.USER_DISCONNECTED + " " + JSON.stringify(data));
			ui.lobby.removeDisconnectedUser(data);
		});

		// server notifies about a new created game by some other player
		socket.on(GAME.CREATE, function (data) {
			console.log(GAME.CREATE + " " + JSON.stringify(data));
			ui.lobby.addNewGame(data);
		});

		// server notifies about a deleted game from public user list
		socket.on(GAME.DELETE, function (data) {
			console.log(GAME.DELETE + " " + JSON.stringify(data));
			ui.lobby.deleteGame(data);
		});

		// server notifies that somebody whishes to play with this player
		socket.on(GAME.JOIN_REQUEST, function (data) {
			console.log(GAME.JOIN_REQUEST + " " + JSON.stringify(data));
		});

		socket.on(GAME.STARTED_GAME, function (data) {
			console.log(GAME.STARTED_GAME + " " + JSON.stringify(data));
			ui.lobby.addStartedGame(data);
		});

		socket.on(GAME.ENDED_GAME, function (data) {
			console.log(GAME.ENDED_GAME + " " + JSON.stringify(data));
			ui.lobby.deleteEndedGame(data);
		});

		// general info regarding current game
		socket.on(GAME.INFO, function (data) {
			console.log(GAME.INFO + " " + JSON.stringify(data));
			if (data.action === GAME.START) {
				serverInterface = new ServerInterface(Client, data);
				ui.load("game");
				ui.game.initialize(serverInterface.getPlayer());
				ui.lobby.resetGameButton();
				if (gameStatus == GAME.STATUS.WAITING) {
					deleteGame();
				}
				this.gameStatus = GAME.STATUS.PLAYING;
				return;
			} else {
				serverInterface.call(data);
			}
		});

		// Scoreboard data (answer for request)
		socket.on(SCOREBOARD.DATA, function (data) {
			console.log(SCOREBOARD.DATA + " (individual) " + JSON.stringify(data));
			ui.scoreboard.refreshData(data);
		});

	};

	/*
		Notifies server that this client has created new game
		and now waits for opponent.
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

	/*
		Requests scoreboard data from server.
	*/
	var requestScoreboard = function () {
		socket.emit(SCOREBOARD.REQUEST);
		console.log(SCOREBOARD.REQUEST);
	};

	var gameEndedHandler = function () {
		serverInterface = null;
		gameStatus = GAME.STATUS.IDLE;
		ui.load("lobby");
		ui.game.finalize();
	};

	var getTimestamp = function () {
		var date = new Date();

		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();

		if (hours < 10) hours = "0" + hours;
		if (minutes < 10) minutes = "0" + minutes;
		if (seconds < 10) seconds = "0" + seconds;

		return (hours  + ":" + minutes  + ":" + seconds);
	};

	return {
		initParams : initParams,
		connect : connect,
		joinScoreboard : joinScoreboard,
		leaveScoreboard : leaveScoreboard,
		emit : emit,
		setID : setID,
		getID : getID,
		getName : getName,
		sendPublicMessage : sendPublicMessage,
		createGame : createGame,
		deleteGame : deleteGame,
		joinGame : joinGame,
		requestScoreboard : requestScoreboard,
		gameEndedHandler : gameEndedHandler,
		getTimestamp : getTimestamp,
		getReplayManager : function () { return replayManager; }
	};

})();

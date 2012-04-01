/*

	serverclient.js

*/

ServerClient = function (data) {

	// ID should be facbook's user ID
	var id = data.id;

	// right now name is equal to ID
	// but in the future it should be
	// user's full name taken from facebook
	var name = data.id;

	var socket = data.socket;

	var gameStatus = GAME.STATUS.IDLE;

	var getID = function () { return id; };
	var getName = function () { return name; };
	var getGameStatus = function () { return gameStatus; };
	var setGameStatus = function (status) { gameStatus = status; };
	var getSocket = function () { return socket; };

	return {
		getID : getID,
		getName : getName,
		getGameStatus : getGameStatus,
		setGameStatus : setGameStatus,
		getSocket : getSocket
	};

};

module.exports.ServerClient = ServerClient;

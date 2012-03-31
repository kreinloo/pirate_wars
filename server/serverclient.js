/*

	serverclient.js

*/

ServerClient = function (ID) {

	// ID should be facbook's user ID
	var id = ID;

	// right now name is equal to ID
	// but in the future it should be
	// user's full name taken from facebook
	var name = ID;

	var gameStatus = GAME.STATUS.IDLE;

	var getID = function () { return id; };
	var getName = function () { return name; };
	var getGameStatus = function () { return gameStatus; };
	var setGameStatus = function (status) { gameStatus = status; };

	return {
		getID : getID,
		getName : getName,
		getGameStatus : getGameStatus,
		setGameStatus : setGameStatus
	}

}

module.exports.ServerClient = ServerClient;

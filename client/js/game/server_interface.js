/*

	server_interface.js

*/

/*
	ServerInterface is the magic glue between following components:
	Player <--> ServerInterface <--> Client <--> Server <--> GameServer
	It wraps the player's data into JSON format and sends it to client
	who will deliver it to the server. It will also invoke the player
	if it receives data from the server.
*/
var ServerInterface = (function() {

	"use strict";

	var client = null;

	var player = null;

	var gameID = null;

	var setPlayer = function (plyr) { player = plyr; };

	var setClient = function (clnt) { client = clnt; };

	var fireAt = function (row, col) {
		sendEvent({ action : GAME.ACTION.FIREAT });
	};

	var addVerticalShip = function (row, col, length) {
		sendEvent({
			action : GAME.ACTION.ADD_VERTICAL_SHIP,
			params : { row : row, col : col, length : length }
		});
	};

	var addHorizontalShip = function (row, col, length) {
		sendEvent({
			action : GAME.ACTION.ADD_VERTICAL_SHIP,
			params : { row : row, col : col, length : length }
		});
	};

	var deleteShip = function (row, col) {
		sendEvent({
			action : GAME.ACTION.DELETE_SHIP,
			params : { row: row, col : col }
		});
	};

	var resetField = function () {
		sendEvent({
			action : GAME.ACTION.RESET_FIELD,
			params : {}
		});
	};

	var confirmAlignment = function () {
		sendEvent({
			action : GAME.ACTION.CONFIRM_ALIGNMENT,
			params : {}
		});
	};

	//var opponentsAlignment = function () {};

	//var getCurrentGame = function () {};

	//var isGameOver = function () {};

	var getActivePlayerId = function () {
		sendEvent({
			action : GAME.ACTION.GET_ACTIVE_PLAYER_ID,
			params : {}
		});
	};

	var call = function (data) {
		player.opponentsTurn(data);
	};

	var startGame = function (data) {
		gameID = data.gid;
	};

	var sendEvent = function (data) {
		client.emit(GAME.INFO, {
			gid : gameID,
			pid : client.getID(),
			action : data.action,
			params : data.params
		});
	};

	var getPlayer = function () {
		return player;
	}

	return {

		setPlayer : setPlayer,
		fireAt : fireAt,
		addVerticalShip : addVerticalShip,
		addHorizontalShip : addHorizontalShip,
		deleteShip : deleteShip,
		resetField : resetField,
		confirmAlignment : confirmAlignment,
		//opponentsAlignment : opponentsAlignment,
		//getCurrentGame : getCurrentGame,
		//isGameOver : isGameOver,
		getActivePlayerId : getActivePlayerId,
		call : call,
		startGame : startGame,
		setClient : setClient,
		getPlayer : getPlayer

	};

});

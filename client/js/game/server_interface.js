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

	var setPlayer = function (plyr) { player = plyr; };

	var setClient = function (clnt) { client = clnt; };

	var fireAt = function (row, col) {};

	var addVerticalShip = function (row, col, length) {};

	var addHorizontalShip = function (row, col, length) {};

	var deleteShip = function (row, col) {};

	var resetField = function () {};

	var confirmAlignment = function () {};

	var opponentsAlignment = function () {};

	var getCurrentGame = function () {};

	var isGameOver = function () {};

	var getActivePlayerId = function () {};

	return {

		setPlayer : setPlayer,
		fireAt : fireAt,
		addVerticalShip : addVerticalShip,
		addHorizontalShip : addHorizontalShip,
		deleteShip : deleteShip,
		resetField : resetField,
		confirmAlignment : confirmAlignment,
		opponentsAlignment : opponentsAlignment,
		getCurrentGame : getCurrentGame,
		isGameOver : isGameOver,
		getActivePlayerId : getActivePlayerId

	};

});

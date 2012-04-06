/*

	server_interface.js

*/

/*
	ServerInterface is the magic glue between following components:
	Player <--> ServerInterface <--> Client <--> Server <--> GameServer <--> Game
	It wraps the player's data into JSON format and sends it to client
	who will deliver it to the server. It will also invoke the player
	if it receives data from the server.
*/
var ServerInterface = (function (_client_, _data_) {

	"use strict";
	var client = _client_;
	var gameID = _data_.gid;
	var opponentName = _data_.opponentName;
	var player; // initialized in the end of this function

	// FUNCTIONS WHICH PLAYER USES //

	this.fireAt = function (row, col) {
		this.sendEvent({ action : GAME.ACTION.FIREAT });
	};

	this.addVerticalShip = function (row, col, length) {
		this.sendEvent({
			action : GAME.ACTION.ADD_VERTICAL_SHIP,
			params : { row : row, col : col, len : length }
		});
	};

	this.addHorizontalShip = function (row, col, length) {
		this.sendEvent({
			action : GAME.ACTION.ADD_HORIZONTAL_SHIP,
			params : { row : row, col : col, len : length }
		});
	};

	this.deleteShip = function (row, col) {
		this.sendEvent({
			action : GAME.ACTION.DELETE_SHIP,
			params : { row: row, col : col }
		});
	};

	this.resetField = function () {
		this.sendEvent({
			action : GAME.ACTION.RESET_FIELD,
			params : {}
		});
	};

	this.confirmAlignment = function () {
		this.sendEvent({
			action : GAME.ACTION.CONFIRM_ALIGNMENT,
			params : {}
		});
	};

	this.emitPrivateMessage = function (message) {
		this.sendEvent({
			action : GAME.ACTION.PRIVATE_CHAT,
			params : { author : client.getName(), msg : message }
		});
	};

	// CLIENT CALLS ONLY THIS METHOD //

	this.call = function (data) {

		if (data.action === GAME.ACTION.PRIVATE_CHAT) {
			player.log(data.params.msg, data.params.author);
			return;
		}

		else if (data.action == GAME.ACTION.FIREAT_RESULT) {
			player.opponentsTurn(data);
			return;
		}

		else if (data.action == GAME.ACTION.LOAD_BATTLE_PHASE) {
			player.loadBattlePhase();
			return;
		}

		else if (data.action == GAME.ACTION.CONFIRM_ALIGNMENT) {
			player.lockShips();
			return;
		}

		else if (data.action == GAME.ACTION.RESET_FIELD) {
			player.resetFieldConfirmed();
			return;
		}

		else if (data.action == GAME.ACTION.GAME_OVER) {
			$("<div>").
				append("<p>" + data.msg + "</p>").
				dialog({
					resizable : false,
					height : 200,
					modal : true,
					buttons : {
						"Return to lobby" : function () {
							$(this).dialog("close");
						}
					},
					title : "Game over",
					close : function (event, ui) {
						client.gameEndedHandler();
					}
				});
			return;
		}

	};

	// SERVERINTERFACE uses its own method to send data to client
	this.sendEvent = function (data) {
		client.emit(GAME.INFO, {
			gid : gameID,
			pid : client.getID(),
			action : data.action,
			params : data.params
		});
	};

	this.getPlayer = function () {
		return player;
	};

	player = new Player (this);

});

/*

	server_interface.js

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
	var ships = [];
	var tableLocked = false;
	var gameHistory = {};

	gameHistory.pid = client.getID();
	gameHistory.gid = gameID;
	gameHistory.moves = [];
	gameHistory.ships = [];
	gameHistory.opponent = opponentName;

	// FUNCTIONS WHICH PLAYER USES //

	this.fireAt = function (row, col) {
		this.sendEvent({
			action : GAME.ACTION.FIREAT,
			params : { row : row, col : col }
		});
	};

	this.addVerticalShip = function (row, col, length) {
		ships.push({
			dir : "vertical",
			row : row,
			col : col,
			len : length
		});
	};

	this.addHorizontalShip = function (row, col, length) {
		ships.push({
			dir : "horizontal",
			row : row,
			col : col,
			len : length
		});
	};

	this.deleteShip = function (row, col) {
		var ship;
		for (var i in ships) {
			ship = ships[i];
			if (ship.row === row && ship.col === col) {
				ships.splice(i, 1);
				break;
			}
		}
	};

	this.resetField = function () {
		if (tableLocked) {
			player.log("Cannot reset already confirmed table.");
			return;
		}
		ships = [];
		player.resetFieldConfirmed();
		player.log("Your ships have been reset.");
	};

	this.confirmAlignment = function () {
		console.log(ships);
		this.sendEvent({
			action : GAME.ACTION.CONFIRM_ALIGNMENT,
			params : ships
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

		else if (data.action === GAME.ACTION.FIREAT) {
			gameHistory.moves.push({
				player : "opponent",
				row : data.params.row,
				col : data.params.col,
				result : data.params.result
			});
			player.opponentsTurn(data);
			return;
		}

		else if (data.action === GAME.ACTION.FIREAT_RESPONSE) {
			gameHistory.moves.push({
				player : "player",
				row : data.params.row,
				col : data.params.col,
				result : data.params.result
			});
			player.fireAtResponse(data);
			return;
		}

		else if (data.action === GAME.ACTION.LOAD_BATTLE_PHASE) {
			player.loadBattlePhase();
			return;
		}

		else if (data.action === GAME.ACTION.CONFIRM_ALIGNMENT) {
			player.lockShips();
			tableLocked = true;
			gameHistory.ships = ships;
			return;
		}

		else if (data.action === GAME.ACTION.RESET_FIELD) {
			player.resetFieldConfirmed();
			return;
		}

		else if (data.action === GAME.ACTION.GAME_OVER) {
			ui.sound.stopMusic();
			if (data.winner) ui.sound.playEffect("VICTORY");
			else ui.sound.playEffect("DEFEAT");
			
			client.getReplayManager().saveGame(gameHistory);
			data.title = "Game over";
			data.callback = client.gameEndedHandler;
			ui.dialog("endgame", data);
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

	this.getOpponentName = function () {
		return opponentName;
	};

	player = new Player (this);

});

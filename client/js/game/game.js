/*

	game.js

*/

Game = (function() {

	"use strict";

	var player = null;

	var initialize = function () {

		$("#game-table-opponent").css("display", "none");
		$("#game-table-ships").css("display", "inline");

		$("#game-table-ships-confirm").click(function () {
			console.log("confirm button clicked");
			if (!player.confirmShipCount()) {
				console.log("all ships have not been placed to table");
			}
			else {
				console.log("all ships are placed");
				$("#game-table-ships").remove();
				$("#game-table-opponent").css("display", "block");
				player.lockTable();
			}

		});

		$("#game-table-ships-reset").click(function () {
			console.log("reset button clicked");
			resetShips();
		});

		$("#game-chat-form").submit(function () {
			player.emitPrivateMessage( $("#game-chat-input-text").val() );
			$("#game-chat-input-text").val("");
			return false;
		})

		fillTables();
		resetShips();

	};

	var fillTables = function () {

		var row = null;
		var i, j;
		for (i = 0; i < 10; i++) {
			row = $("<div class='game-table-row'>");
			for (j = 0; j < 10; j++) {
				row.append(
					$("<div class='game-table-cell'>").attr(
						"id", "user_" + i + "_" + j));
			}
			$("#game-table-user").append(row);
		}

		for (i = 0; i < 10; i++) {
			row = $("<div class='game-table-row'>");
			for (j = 0; j < 10; j++) {
				row.append(
					$("<div class='game-table-cell'>").attr(
					"id", "opponent_" + i + "_" + j).
						addClass("game-table-opponent-cell"));
				}
				$("#game-table-opponent").append(row);
		}

	};

	var resetShips = function () {

		$(".game-table-ship").remove();
		player.clearTable();

		var shipFactory = new ShipFactory();
		var left = 360;
		var top = 10;
		var ship = null;
		for (var i = 0; i < 4; i++) {
			ship = shipFactory.createShip(1, "horizontal", player);
			ship.getElement().css("top", top);
			ship.getElement().css("left", left);
			left += 35;
		}

		left = 360;
		top += 40;

		for (i = 0; i < 3; i++) {
			ship = shipFactory.createShip(2, "horizontal", player);
			ship.getElement().css("top", top);
			ship.getElement().css("left", left);
			left += 70;
		}

		left = 360;
		top += 40;

		for (i = 0; i < 2; i++) {
			ship = shipFactory.createShip(3, "horizontal", player);
			ship.getElement().css("top", top);
			ship.getElement().css("left", left);
			left += 105;
		}

		left = 360;
		top += 40;

		ship = shipFactory.createShip(4, "horizontal", player);
		ship.getElement().css("top", top);
		ship.getElement().css("left", left);

	};

	return {

		initialize : initialize,
		setPlayer : function(plyr) { player = plyr; }

	};

})();

var TILE = {
	SHIP_NOSE: "gfx/ShipNose.png",
	SHIP_BASE1: "gfx/ShipBase1.png",
	SHIP_BASE2: "gfx/ShipBase2.png",
	SHIP_BASE3: "gfx/ShipBase3.png",
	SHIP_TAIL: "gfx/ShipTail.png",
	SHIP_SINGLE1: "gfx/SingleShip1.png",
	SHIP_SINGLE2: "gfx/SingleShip2.png",
	FOG1: "gfx/FogTexture.png",
	FOG_EDGE1: "gfx/FogEdgeTexture.png",
	FIRE: "gfx/Fire.gif",
	SPLASH: "gfx/WaterSplash.png"
};

var SHIPS = {

	SHIP_1_horizontal : "gfx/SHIP_1_horizontal.png",
	SHIP_1_vertical : "gfx/SHIP_1_vertical.png",

	SHIP_2_horizontal : "gfx/SHIP_2_horizontal.png",
	SHIP_2_vertical : "gfx/SHIP_2_vertical.png",

	SHIP_3_horizontal : "gfx/SHIP_3_horizontal.png",
	SHIP_3_vertical : "gfx/SHIP_3_vertical.png",

	SHIP_4_horizontal : "gfx/SHIP_4_horizontal.png",
	SHIP_4_vertical : "gfx/SHIP_4_vertical.png"

};

function drawTile (isSelf, row, column, tileToDraw, rotate) {

	if (tileToDraw != TILE.FIRE && tileToDraw != TILE.SPLASH){
		if (isSelf) var cellId = "#user_";
		else var cellId = "#opponent_";
		cellId += row + "_" + column;

		var tile = $("<img>").attr("src", tileToDraw);
		var cell = $(cellId).prepend(tile);
	}
	else {
		if (isSelf) var cellId = "#user_";
		else var cellId = "#opponent_";
		cellId += row + "_" + column;

		var tile = $("<img>").attr("src", tileToDraw);
		var cell = $(cellId).append(tile);
	}
	if (rotate)
		cell.addClass("rotate90");

}

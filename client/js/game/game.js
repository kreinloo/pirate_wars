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
			player.confirmButtonClicked();
		});

		$("#game-table-ships-reset").click(function () {
			player.resetButtonClicked();
		});

		$("#game-chat-form").submit(function () {
			player.chatFormSubmitted( $("#game-chat-input-text").val() );
			$("#game-chat-input-text").val("");
			return false;
		});

		fillTables();

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

	var finalize = function () {
		$("#game-table-user").children().remove();
		$("#game-table-opponent").children().remove();
		$("#game-table-opponent").css("display", "inline");
		$("#game-table-ships").css("display", "none");
		$("#game-table-ships-confirm").off("click");
		$("#game-table-ships-reset").off("click");
		$("#game-chat-form").off("submit");
	};

	return {
		initialize : initialize,
		setPlayer : function(plyr) { player = plyr; },
		finalize : finalize
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

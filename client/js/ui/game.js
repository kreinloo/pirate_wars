/*

	game.js

	Game object handles all the DOM-related tasks in the game view.
	It should be accessed only through ui.game variable.

*/

var Game = (function() {

	"use strict";

	this.initialize = function (player) {

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

		this.fillTables();
		for (var i =0;i<10;i++){
			for (var j = 0;j<10;j++){
				drawTile(false,i,j,TILE.FOG_UP,false);
				drawTile(false,i,j,TILE.FOG_BOTTOM,false);
				drawTile(false,i,j,TILE.FOG_LEFT,false);
				drawTile(false,i,j,TILE.FOG_RIGHT,false);
				drawTile(false,i,j,TILE.FOG,false);
			}
		}

	};

	this.fillTables = function () {

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

	this.finalize = function () {
		$("#game-table-user").children().remove();
		$("#game-table-opponent").children().remove();
		$("#game-table-opponent").css("display", "inline");
		$("#game-table-ships").css("display", "none");
		$("#game-table-ships-confirm").off("click");
		$("#game-table-ships-reset").off("click");
		$("#game-chat-form").off("submit");
		$("#game-chat-log").children().remove();
	};

	this.log = function (message, author) {
		if (author !== undefined) {
			message = author + ": " + message;
		}
		var div = $("<div>");
		div.append("<b>" + Client.getTimestamp() + "</b> " + message);
		$("#game-chat-log").append(div);
		$("#game-chat-log").
			scrollTop($("#game-chat-log").prop("scrollHeight"));
	};

	this.loadBattlePhase = function (player) {
		$("#game-table-ships").css("display", "none");
		$("#game-table-opponent").css("display", "block");
		$(".game-table-opponent-cell").click(function () {
			var id = $(this).attr("id").split("_");
			var row = parseInt(id[1], 10);
			var col = parseInt(id[2], 10);
			player.makeMove(row, col);
		});
	};

	this.lockShips = function () {
		$(".game-table-ship").draggable("disable");
		$(".game-table-ship").css("opacity", "100");
	};

	this.removeListenerFromOpponentCells = function () {
		$(".game-table-opponent-cell").off("click");
	};

	this.removeShips = function () {
		$(".game-table-ship").remove();
	};

});

function drawTile (isSelf, row, column, tileToDraw, rotate) {

	var cellId, tile, cell;

	if (tileToDraw != TILE.FIRE && tileToDraw != TILE.SPLASH) {
		if (isSelf) cellId = "#user_";
		else cellId = "#opponent_";
		cellId += row + "_" + column;

		tile = $("<img>").attr("src", tileToDraw);
		cell = $(cellId).prepend(tile);
	}
	else {
		if (isSelf) cellId = "#user_";
		else cellId = "#opponent_";
		cellId += row + "_" + column;

		tile = $("<img>").attr("src", tileToDraw);
		cell = $(cellId).append(tile);
	}
	if (rotate)
		cell.addClass("rotate90");

}

function removeFog(row,col) {
		var cellId = "#opponent_" + row + "_" + col;
		removeTile(row,col, TILE.FOG);
		$(cellId).removeClass("full-fog-cell");
		if (row > 0){
			removeTile(row - 1, col, TILE.FOG_BOTTOM);
		}
		if (row < 9){
			removeTile(row + 1, col, TILE.FOG_UP);
		}
		if (col > 0){
			removeTile(row, col - 1, TILE.FOG_RIGHT);
		}
		if (col < 9){
			removeTile(row, col + 1, TILE.FOG_LEFT);
		}
}
function removeTile(row, col,tile){
	$("#opponent_"+ row+"_"+ col).children("img[src='"+ tile +"']").remove();
}

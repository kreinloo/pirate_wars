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
		$("#game-chat-log").children().remove()
	};

});

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

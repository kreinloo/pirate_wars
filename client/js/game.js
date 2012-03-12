/*

	game.js

*/

var SHIPS = {

	SHIP_4 : "gfx/Ship_4.png"

};

$(document).ready(function () {

	$("#game-table-opponent").css("display", "none");

	$("#game-table-ships").css("display", "inline");

	$("#game-table-ships").append(
		$("<img>").attr("src", SHIPS.SHIP_4).
				addClass("game-ship-draggable").
				draggable({ snap : ".game-table-cell" })
	);

	$(".game-table-cell").droppable({
		drop : function (event, ui) {
			console.log($(this).attr("id"));
		}
	})

});


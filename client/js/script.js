/*

	

*/

TILE = {
  SHIP_NOSE: "gfx/ShipNose.png",
  SHIP_BASE1: "gfx/ShipBase1.png",
  SHIP_BASE2: "gfx/ShipBase2.png",
  SHIP_BASE3: "gfx/ShipBase3.png",
  SHIP_TAIL: "gfx/ShipTail.png"
}

$(document).ready(function () {
	/* sample text */
	$("#game-chat-log").append("<div><b>user1:</b> hello</div>");	
	$("#game-chat-log").append("<div><b>user2:</b> hello</div>");	
	$("#game-chat-log").append("<div><b>user1:</b> let's play</div>");	
	$("#game-chat-log").append("<div><b>user2:</b> ok ...</div>");	
	$("#game-chat-log").scrollTop($(".game-chat-log").prop("scrollHeight"));

	$("#lobby-chat-log").append("<div class='chat-message'>21:01:32 " +
		"<b>John 'Hannibal' Smith:</b> I love it when a plan comes together!</div>");

	$("#lobby-chat-log").append("<div class='chat-message'>21:02:01 " +
		"<b>B.A. Baracus:</b> I ain't flying Hannibal!</div>");

	$("#lobby-chat-log").scrollTop($("#lobby-chat-log").prop("scrollHeight"));

	$("#lobby-chat-userlist-table").append("<tr><td>B.A. Baracus</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>H.M. Murdock</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>John 'Hannibal' Smith</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>Templeton 'Face' Peck</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>Tawnia Baker</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>Amy Amanda Allen</td></tr>");

	$("#lobby-games-running-list-table").append(
		"<tr><td>B.A. Baracus</td><td>vs</td><td>H.M. Murdock</td></tr>");
	$("#lobby-games-running-list-table").append(
		"<tr><td>John 'Hannibal' Smith</td><td>vs</td><td>Templeton 'Face' Peck</td></tr>");
	$("#lobby-games-running-list-table").append(
		"<tr><td>Tawnia Baker</td><td>vs</td><td>Amy Amanda Allen</td></tr>");

	$("#lobby-chat-input-text").keypress(function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			var message = $("#lobby-chat-input-text").val();
			$("#lobby-chat-input-text").val("");
			$("#lobby-chat-log").append(
				"<div class='chat-message'><b>user:</b> " + message + "</div>");
			$("#lobby-chat-log").scrollTop($("#lobby-chat-log").prop("scrollHeight"));
		}; 
	});

	$(".menu-item").hover(
		function () {
			$(this).css("border", "2px solid white");
		},
		function () {
			$(this).css("border", "none");
		}
	);

	fillTables ();
	drawShips ();
});


function fillTables () {

	for (var i = 0; i < 10; i++) {
		var row = $("<div class='game-table-row'>");
		for (j = 0; j < 10; j++) {
			row.append(
				$("<div class='game-table-cell'>").attr(
					"id", "user" + i + "x" + j));
		}
		$("#game-table-user").append(row);
	}

	for (var i = 0; i < 10; i++) {
		var row = $("<div class='game-table-row'>");
		for (j = 0; j < 10; j++) {
			row.append(
				$("<div class='game-table-cell'>").attr(
					"id", "opponent" + i + "x" + j));
		}
		$("#game-table-opponent").append(row);
	}

}
function drawShips () { 
  //4x 1-ships
  drawShipTile(true, 7, 3, TILE.SHIP_BASE2);
  
  drawShipTile(true, 2, 1, TILE.SHIP_BASE2);
  
  drawShipTile(true, 5, 8, TILE.SHIP_BASE2);
  
  drawShipTile(true, 7, 7, TILE.SHIP_BASE2);
  
  //3x 2-ships
  drawShipTile(true, 2, 3, TILE.SHIP_NOSE);
  drawShipTile(true, 1, 3, TILE.SHIP_TAIL);
  
  drawShipTile(true, 9, 8, TILE.SHIP_NOSE, true);
  drawShipTile(true, 9, 9, TILE.SHIP_TAIL, true);
  
  drawShipTile(true, 6, 0, TILE.SHIP_NOSE, true);
  drawShipTile(true, 6, 1, TILE.SHIP_TAIL, true);
  
  //2x 3-ships
  drawShipTile(true, 4, 1, TILE.SHIP_NOSE, true);
  drawShipTile(true, 4, 2, TILE.SHIP_BASE3, true);
  drawShipTile(true, 4, 3, TILE.SHIP_TAIL, true);
  
  drawShipTile(true, 2, 8, TILE.SHIP_NOSE);
  drawShipTile(true, 1, 8, TILE.SHIP_BASE3);
  drawShipTile(true, 0, 8, TILE.SHIP_TAIL);
  
  //1x 4-ships
  drawShipTile(true, 5, 6, TILE.SHIP_NOSE);
  drawShipTile(true, 3, 6, TILE.SHIP_BASE3);
  drawShipTile(true, 4, 6, TILE.SHIP_BASE3);
  drawShipTile(true, 2, 6, TILE.SHIP_TAIL);
}

// TODO: drawShip function to automatically draw individual tiles

function drawShipTile (isSelf, row, column, tileToDraw, rotate) {
  if (isSelf) var cellId = "#user";
  else var cellId = "#opponent";
  cellId += row + "x" + column;
  
  var cell = $(cellId).append($("<img>").attr("src", tileToDraw));
  
  if (rotate) {
    cell.addClass("rotate90");
  }
}

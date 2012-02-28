/*

	

*/

TILE = {
  SHIP_NOSE: "gfx/ShipNose.png",
  SHIP_BASE1: "gfx/ShipBase1.png",
  SHIP_BASE2: "gfx/ShipBase2.png",
  SHIP_BASE3: "gfx/ShipBase3.png",
  SHIP_TAIL: "gfx/ShipTail.png",
  SHIP_SINGLE1: "gfx/SingleShip1.png",
  SHIP_SINGLE2: "gfx/SingleShip2.png",
  FOG1: "gfx/FogTexture.png",
  FOG_EDGE1: "gfx/FogEdgeTexture.png",
  FIRE: "gfx/Fire.gif"
  
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

/*
	$("#lobby-chat-userlist-table").append("<tr><td>B.A. Baracus</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>H.M. Murdock</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>John 'Hannibal' Smith</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>Templeton 'Face' Peck</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>Tawnia Baker</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>Amy Amanda Allen</td></tr>");
*/
	$("#lobby-chat-userlist-table").append("<tr><td>General Hunt Stockwell</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>Colonel Lynch</td></tr>");
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
			$(this).css("color", "white");
		},
		function () {
			$(this).css("color", "black");
		}
	);

	fillTables ();
	drawShips ();
	fillScoreboard ();
	fillReplay ();
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
  // 4x 1-ships
  drawShip(true, 7, 3, 1);
  drawShip(true, 2, 1, 1);
  drawShip(true, 5, 8, 1);
  drawShip(true, 7, 7, 1);
  
  // 3x 2-ships
  drawShip(true, 1, 3, 2);
  drawShip(true, 9, 8, 2, true);
  drawShip(true, 6, 0, 2, true);

  // 2x 3-ships
  drawShip(true, 4, 1, 3, true);
  drawShip(true, 0, 8, 3);
  
  // 1x 4-ships
  drawShip(true, 2, 6, 4);
  
  // The Roof is on fire!
  $("#user4x6").append($("<img>").attr("src", TILE.FIRE));
  
  // Generate temporary field of fog over opponent's field 
  for (var row = 0; row < 10; row++) {
    for (var column = 0; column < 10; column++) {
      // Blah .. blah
      if (row == 5 && column == 6) {
        var fogEdge = $("<img>").attr("src", TILE.FOG_EDGE1);
        $("#opponent5x6").append(fogEdge);
      }
      else
        drawTile(false, row, column, TILE.FOG1);
    }
  }
}

function drawShip (isSelf, row, column, size, rotate) {
  // TODO: Colour of the sails, more variations?
  
  if (size == 1) {
    drawTile(true, row, column, TILE.SHIP_SINGLE1);
    return;
  }
  
  for (var i = 0; i < size; i++) {
    switch (i) {
    case 0:
      if (rotate) drawTile(true, row, column, TILE.SHIP_NOSE, rotate);
      else drawTile(true, row, column, TILE.SHIP_TAIL);
      break;
    case size-1:
      if (rotate) drawTile(true, row, column, TILE.SHIP_TAIL, rotate);
      else drawTile(true, row, column, TILE.SHIP_NOSE);
      break;
    default:
      drawTile(true, row, column, TILE.SHIP_BASE3, rotate);
    }
    if (rotate) column++;
    else row++;
  }

}

function drawTile (isSelf, row, column, tileToDraw, rotate) {
  if (isSelf) var cellId = "#user";
  else var cellId = "#opponent";
  cellId += row + "x" + column;
  
  var tile = $("<img>").attr("src", tileToDraw);
  var cell = $(cellId).append(tile);
  
  if (rotate)
    cell.addClass("rotate90");
}

function fillScoreboard () {

	$("#scoreboard-table").append(
		$("<tr>").append("<td>1</td><td>B.A. Baracus</td><td>66</td>")
	);

	$("#scoreboard-table").append(
		$("<tr>").append("<td>2</td><td>John 'Hannibal' Smith</td><td>32</td>")
	);

	$("#scoreboard-table").append(
		$("<tr>").append("<td>3</td><td>H.M. Murdock</td><td>12</td>")
	);
}

function fillReplay () {

	$("#replay-table").append(
		$("<tr>").append("<td>1</td><td>Templeton 'Face' Peck</td>" + 
			"<td>27.02.2012</td><td>WIN</td><td><u><a href='#'>Play</a></u></td>")
	);

	$("#replay-table").append(
		$("<tr>").append("<td>2</td><td>Tawnia Baker</td>" + 
			"<td>27.02.2012</td><td>LOSS</td><td><u><a href='#'>Play</a></u></td>")
	);

}

/*

	game.js

*/

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
  
}

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

function PlayerClient (Server) {

	var server = Server;
	var id;
	var name;
	var gameTable;
	var opponentTable;

	gameTable = new Array(10);
	for (var i = 0; i < 10; i++) {
		gameTable[i] = new Array(10);
		for (var j = 0; j < 10; j++)
			gameTable[i][j] = 0;
	}
	
	opponentTable = new Array(10);
	for (var i = 0; i < 10; i++) {
		opponentTable[i] = new Array(10);
		for (var j = 0; j < 10; j++)
			opponentTable[i][j] = 0;
	}
	
	
	return {

		getID : function () { return id; },

		getName : function () { return name; },

		getGameTable : function () { return gameTable; },

		printGameTable : function () {
			for (var i = 0; i < 10; i++)
				console.log (gameTable[i]);
		},

		addShip : function (ship, coords) {

			var row = coords["row"];
			var col = coords["col"];
			var length = ship.getLength();
			var direction = ship.getDirection();

			console.log("addShip: row: " + row + " col: " + col + " length: " +
				length + " direction: " + direction);

			if (direction == "horizontal") {
				if (col < 0 || col + length > 10 || row < 0 || row > 9)
					return false;
			} else {
				if (row < 0 || row + length > 10 || col < 0 || col > 9)
					return false;
			}

			var startRow = row - 1;
			var startCol = col - 1;

			var endRow;
			var endCol;

			if (direction == "horizontal") {
				endRow = row + 1;
				endCol = col + length;
			} else {
				endRow = row + length;
				endCol = col + 1;
			}

			if (startRow < 0)
				startRow = 0;
			if (startCol < 0)
				startCol = 0;
			if (endRow > 9)
				endRow = 9;
			if (endCol > 9)
				endCol = 9;

			for (var i = startRow; i <= endRow; i++) {
				for (var j = startCol; j <= endCol; j++) {
					if (gameTable[i][j] != 0)
						return false;
				}
			}

			for (var i = 0; i < length; i++) {
				if (direction == "horizontal")
					gameTable[row][col+i] = 1;
				else
					gameTable[row+i][col] = 1;
			}

			ship.setCoords(coords);
			
			if (direction == "horizontal"){
				server.addHorizontalShip(row,col,length);
			}
			else if (direction == "vertical"){
				server.addVerticalShip(row,col,length);
			}
			return true;

		},

		deleteShip : function (ship) {
			var row = ship.getCoords()["row"];
			var col = ship.getCoords()["col"];

			for (var i = 0; i < ship.getLength(); i++) {
				if (ship.getDirection() == "horizontal")
					gameTable[row][col+i] = 0;
				else
					gameTable[row+i][col] = 0;
			}
			// Communicate to Server that we want to delete a ship 
			server.deleteShip(row,col);
		},

		rotateShip : function (ship) {
			if (Object.keys(ship.getCoords()).length == 0) {
				ship.flipDirection();
				return true;
			}

			var coords = ship.getCoords();

			this.deleteShip(ship);
			ship.flipDirection();
			var res = this.addShip(ship, coords);

			if (res) {
				return true;
			} else {
				ship.flipDirection();
				this.addShip(ship, coords);
				return false;
			}
		},

		clearTable : function () {
			gameTable = null;
			gameTable = new Array(10);
			for (var i = 0; i < 10; i++) {
				gameTable[i] = new Array(10);
				for (var j = 0; j < 10; j++)
					gameTable[i][j] = 0;
			}
			server.resetField();
		},
		
		confirmShipCount : function () {
			var v = 0;
			for (var i = 0; i < 10; i++) {
				for (var j = 0; j < 10; j++) {
					v += gameTable[i][j];
				}
			}

			if (v == 20)
				return true;
			else
				return false;
		},

			
		OpponentsTurn : function () {
			var result = server.waitForOpponent();
			switch (result[2]) {
				case 10 :
					drawTile(true,result[0],result[1],TILE.SPLASH,false);
					break;
				case 11 :
					drawTile(true,result[0],result[1],TILE.FIRE,false);
					break;
				case 12 : 
					drawTile(true,result[0],result[1],TILE.FIRE,false);
					break;

				case 13 :
					drawTile(true,result[0],result[1],TILE.FIRE,false);
					this.removeListenerFromOpponentCells()
					alert ("SIRE ! SIRE! We have no ships left . RETREAAAT!!");
					break;

			}

		},

		findDirectionAndLength : function(row, col){
			var Horizontal;
			var Vertical;
			var rowCord = row;
			var colCord = col;
			if (row != 0 && row != 9 )
				Horizontal = opponentTable[row+1][col] != 1 & opponentTable[row-1][col] != 1 ? true:false;
			else if (row == 0)
				Horizontal = opponentTable[row+1][col]!=1 ? true:false;

			else if (row == 9)
				Horizontal = opponentTable[row-1][col]!=1 ? true:false;
			if (col != 0 && col != 9 )
				Vertical = opponentTable[row][col+1] !=1 & opponentTable[row][col-1] !=1 ? true:false;
			else if (col == 0)
				Vertical = opponentTable[row][col+1]!=1 ? true:false;

			else if (row == 9)
				Vertical = opponentTable[row][col-1]!=1 ? true:false;

			var length = 1 ;
			if (Vertical && Horizontal) {
				return [row,col,1,false];
			}
			if (Horizontal) {
				// check Horizontally to the right
				for (var i = 1; i<4;i++){
					if (col+ i <9){
						if (opponentTable[row][col+i] == 1)
							length ++ ;
						else break;
					}
					else break;
				}
				// check Horizontally to the left
				for (var i = 1; i<4;i++) {
					if (col - i >= 0){
						if (opponentTable[row][col-i] == 1) {
							length ++ ;
							colCord-- ;
						}
						else break;
					}
					else break;
				}
			}
			if (Vertical) {
				// check vertivally to the downward
				for (var i = 1; i<4;i++) {
					if (row+ i <9) {
						if (opponentTable[row+1][col] == 1)
							length ++ ;
						else break;
					}
					else break;
				}
				// check vertically upward
				for (var i = 1; i<4;i++) {
					if (row - i >= 0) {
						if (opponentTable[row-1][col] == 1) {
							length ++ ;
							rowCord --;
						}
						else break;
					}
					else break;
				}
			}
			// By now we know the direction and the length of the ship .. 
			return [rowCord,colCord,length,Vertical ? 1:0];
			
		//once we have the direction and length of enemy ship, we can draw it.  

		},

		makeMove : function (row, col) {
			if (server.getActivePlayerId() != 0){
				alert("Not your turn sire"); 
				return;
			}
			if (opponentTable[row][col]!= 0){
				alert("we have already hit there sire!");
				return;
			}
			outcome = server.fireAt(row ,col);
			switch (outcome) {
				case 10 :// reveal fog on that tile 
					drawTile(false,row,col,TILE.SPLASH,false);
					opponentTable[row][col] = 2;
					break;
				case 11 : //reveal fog on that tile
					drawTile(false,row,col,TILE.FIRE,false);
					opponentTable[row][col] = 1;
					break;
				case 12 : //reveal fog, 
					opponentTable[row][col] = 1;
					var list = this.findDirectionAndLength(row, col);
					console.log(list);
					var Rotation = list[3]==1 ? true : false ;
					switch (list[2]){
						case 1: 
							drawTile(false,row,col,TILE.FIRE,false);
							drawTile(false,list[0],list[1],
								SHIPS.SHIP_1_horizontal,Rotation);
							break;
						case 2:
							drawTile(false,row,col,TILE.FIRE,false);
							drawTile(false,list[0],list[1],
								SHIPS.SHIP_2_horizontal,Rotation);
							break;
						case 3:
							drawTile(false,row,col,TILE.FIRE,false);
							drawTile(false,list[0],list[1],
								SHIPS.SHIP_3_horizontal,Rotation);
							break;
						case 4:
							drawTile(false,row,col,TILE.FIRE,false);
							//Ship(4,"horizontal",this );
							drawTile(false,list[0],list[1],
								SHIPS.SHIP_4_horizontal,Rotation);
							break;
					}

					break;

				case 13 :
					opponentTable[row][col] = 1;
					var list = this.findDirectionAndLength(row, col);
					switch (list[2]){
						case 1: 
							drawTile(false,row,col,TILE.FIRE,false);
							drawTile(false,list[0],list[1],
								SHIPS.SHIP_1_horizontal,Rotation);
							break;
						case 2:
							drawTile(false,row,col,TILE.FIRE,false);
							drawTile(false,list[0],list[1],
								SHIPS.SHIP_2_horizontal,Rotation);
							break;
						case 3:
							drawTile(false,row,col,TILE.FIRE,false);
							drawTile(false,list[0],list[1],
								SHIPS.SHIP_3_horizontal,Rotation);
							break;
						case 4:
							drawTile(false,row,col,TILE.FIRE,false);
							//Ship(4,"horizontal",this );
							drawTile(false,list[0],list[1],
								SHIPS.SHIP_4_horizontal,Rotation);
							break;
					};
					alert ("SIRE ! We have won a glorious battle today! Beer and women for everybody!! ");
					this.removeListenerFromOpponentCells()
					break;

			}
			if (outcome != 13){
				this.OpponentsTurn();
			};
		},

		lockShips : function () { $(".game-table-ship").draggable("disable"); },

		addListenerToOpponentCells : function () {
			$(".game-table-opponent-cell").click(function () {
				var id = $(this).attr("id").split("_");
				var row = parseInt(id[1]);
				var col = parseInt(id[2]);
				console.log("row: " + row + " col: " + col + " clicked");
				player.makeMove(parseInt(row), parseInt(col));
			})
		},

		removeListenerFromOpponentCells : function () {
			$(".game-table-opponent-cell").off("click");
		},
/*
		fireAt : function (row, col) {
			try {
				var result = server.fireAt(row, col);
				console.log("result: " + result);
				// TODO :
				// add textures to opponent's table
			} catch (ex) {
				console.log("Exception: " + ex);
			}

			// we get instant response from the dummy server
			var opponentMove = server.waitForOpponent()
			// TODO:
			// add textures to player's table

		},
*/
		lockTable : function () {
			this.lockShips();
			this.addListenerToOpponentCells();
			// Signal the server that we are ready to start the game.
			server.opponentsAlignment();
			server.confirmAlignment();
		}

	}

};

var player = new PlayerClient ( new Server() );

$(document).ready(function () {

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

	resetShips();

});

function resetShips () {

	$(".game-table-ship").remove();
	player.clearTable();

	var shipFactory = new ShipFactory();
	var left = 360;
	var top = 10;

	for (var i = 0; i < 4; i++) {
		var ship = shipFactory.createShip(1, "horizontal", player);
		ship.getElement().css("top", top);
		ship.getElement().css("left", left);
		left += 35;
	}

	left = 360;
	top += 40;

	for (var i = 0; i < 3; i++) {
		var ship = shipFactory.createShip(2, "horizontal", player);
		ship.getElement().css("top", top);
		ship.getElement().css("left", left);
		left += 70;
	}

	left = 360;
	top += 40;

	for (var i = 0; i < 2; i++) {
		var ship = shipFactory.createShip(3, "horizontal", player);
		ship.getElement().css("top", top);
		ship.getElement().css("left", left);
		left += 105;
	}

	left = 360;
	top += 40;

	var ship = shipFactory.createShip(4, "horizontal", player)
	ship.getElement().css("top", top);
	ship.getElement().css("left", left);

}

function Ship (len, dir, plyr) {

	var length = len;
	var direction = dir;
	var player = plyr;
	var element = $("<img>");
	var coords = {};

	switch (length) {

		case 1:
			if (direction == "horizontal") 
				element.attr("src", SHIPS.SHIP_1_horizontal);
			else
				element.attr("src", SHIPS.SHIP_1_vertical);
			break;

		case 2:
			if (direction == "horizontal") 
				element.attr("src", SHIPS.SHIP_2_horizontal);
			else
				element.attr("src", SHIPS.SHIP_2_vertical);
			break;

		case 3:
			if (direction == "horizontal")
				element.attr("src", SHIPS.SHIP_3_horizontal);
			else
				element.attr("src", SHIPS.SHIP_3_vertical);
			break;

		case 4:
			if (direction == "horizontal")
				element.attr("src", SHIPS.SHIP_4_horizontal);
			else
				element.attr("src", SHIPS.SHIP_4_vertical);
			break;

	}

	element.draggable({

		snap : ".game-table-cell",

		snapMode: "inner",

		containment: "#game-tablearea",

		start : function (event, ui) {
			$(this).data("top", $(this).css("top"));
			$(this).data("left", $(this).css("left"));

			if (Object.keys( $(this).data("obj").getCoords() ).length > 0) {
				$(this).data("obj").
				getPlayerClient().deleteShip( $(this).data("obj") );
			}
		},

		stop : function (event, ui) {
			var top = parseInt($(this).css("top"));
			var left = parseInt($(this).css("left"));
			if ( $(this).data("obj").getDirection() == "horizontal" ) {
				top -= 12;
				left -= 10;
			}
			else {
				top -= 10;
				left -= 12;
			}
			var res;
			if (top < 0 || left < 0) {
				res = false;
			} else {
				res = $(this).data("obj").getPlayerClient().addShip(
						$(this).data("obj"), {
							row : parseInt(top / 32),
							col : parseInt(left / 32)
						}
					);
			}
			if (!res) {
				$(this).css("top", $(this).data("top"));
				$(this).css("left", $(this).data("left"));
				if ( $(this).data("obj").hasCoords() )
					$(this).data("obj").getPlayerClient().
						addShip($(this).data("obj"),
						$(this).data("obj").getCoords());
			}
		}
		
	});

	element.dblclick(function () { $(this).data("obj").rotateShip(); });
	element.css("position", "absolute");
	element.addClass("game-table-ship");

	$("#game-table-user").append(element);

	return {

		rotateShip : function () {

			var res = player.rotateShip(this);

			if (res) {
				switch (length) {

				case 1:
					if (direction == "horizontal")
						element.attr("src", SHIPS.SHIP_1_horizontal);
					else
						element.attr("src", SHIPS.SHIP_1_vertical);
					break;

				case 2:
					if (direction == "horizontal")
						element.attr("src", SHIPS.SHIP_2_horizontal);
					else
						element.attr("src", SHIPS.SHIP_2_vertical);
					break;

				case 3:
					if (direction == "horizontal")
						element.attr("src", SHIPS.SHIP_3_horizontal);
					else
						element.attr("src", SHIPS.SHIP_3_vertical);
					break;

				case 4:
					if (direction == "horizontal")
						element.attr("src", SHIPS.SHIP_4_horizontal);
					else
						element.attr("src", SHIPS.SHIP_4_vertical);
					break;
				}
			}
		},

		flipDirection : function () {
			if (direction == "horizontal")
				direction = "vertical";
			else
				direction = "horizontal";
		},

		getPlayerClient : function () { return player; },

		getLength : function () { return length; },

		getDirection : function () { return direction; },

		setCoords : function (newCoords) { coords = newCoords; },

		getCoords : function () { return coords; },

		clearCoords : function () { coords = {}; },

		hasCoords : function () { return Object.keys(coords).length > 0;},

		getElement : function () { return element; },

		setShipPointer : function (ship) { element.data("obj", ship) },

	}

}

function ShipFactory () {

	return  {

		createShip : function (length, direction, player) {
			var ship = new Ship (length, direction, player);
			ship.setShipPointer(ship);
			return ship;
		}
	}
}

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


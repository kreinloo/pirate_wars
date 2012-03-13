/*

	game.js

*/

function Client () {

	var id;
	var name;
	var gameTable;

	gameTable = new Array(10);
	for (var i = 0; i < 10; i++) {
		gameTable[i] = new Array(10);
		for (var j = 0; j < 10; j++)
			gameTable[i][j] = 0;
	}



	this.getID = function () { return id; }

	this.getName = function () { return name; }

	this.getGameTable = function () { return gameTable; }

	this.printGameTable = function () {
		for (var i = 0; i < 10; i++)
			console.log (gameTable[i]);
	}

	this.addShip = function (cellId, ship) {

		var coords = cellId.split("_");
		var row = parseInt(coords[1]);
		var col = parseInt(coords[2]);

		var length = ship.length;
		var direction = ship.direction;

		console.log("row: " + row + " col: " + col + " length: " + length + " direction: " + direction);

		var startRow;
		var startCol;
		var endRow;
		var endCol;

		switch (length) {

			case 1:
				startRow = row - 1;
				startCol = col - 1;
				endRow = row + 1;
				endCol = col + 1;
				break;

			case 2:
				startRow = row - 1;
				startCol = col - 1;

				if (direction == "horizontal") {
					endRow = row + 1;
					endCol = col + 2;
				} else {
					endRow = row + 2;
					endCol = col + 1;
				}
				break;

			case 3:
				if (direction == "horizontal") {
					startRow = row - 1;
					startCol = col - 2;
					endRow = row + 1;
					endCol = col + 2;
				} else {
					startRow = row - 2;
					startCol = col - 1;
					endRow = row + 2;
					endCol = col + 1;
				}
				break;

			case 4:
				if (direction == "horizontal") {
					startRow = row - 1;
					startCol = col - 2;
					endRow = row + 1;
					endCol = col + 3;
				} else {
					startRow = row - 2;
					startCol = col - 1;
					endRow = row + 3;
					endCol = col + 1;
				}
				break;
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

		switch (length) {

		case 1:
			gameTable[row][col] = 1;
			ship.cellId = cellId;
			ship.coords = [ [row, col] ];
			break;

		case 2:
			if (direction == "horizontal") {
				gameTable[row][col] = 1;
				gameTable[row][col+1] = 1;

				ship.cellId = cellId;
				ship.coords = [ [row, col], [row, col+1] ];
			}
			else {
				gameTable[row][col] = 1;
				gameTable[row+1][col] = 1;

				ship.cellId = cellId;
				ship.coords = [ [row, col], [row+1, col] ];
			}
			break;

		case 3:
			if (direction == "horizontal") {
				gameTable[row][col] = 1;
				gameTable[row][col+1] = 1;
				gameTable[row][col-1] = 1;

				ship.cellId = cellId;
				ship.coords = [ [row, col], [row, col+1], [row, col-1] ];
			}

			else {
				gameTable[row][col] = 1;
				gameTable[row+1][col] = 1;
				gameTable[row-1][col] = 1;

				ship.cellId = cellId;
				ship.coords = [ [row, col], [row+1, col], [row-1, col] ];
			}
			break;

		case 4:
			if (direction == "horizontal") {
				gameTable[row][col] = 1;
				gameTable[row][col+1] = 1;
				gameTable[row][col+2] = 1;
				gameTable[row][col-1] = 1;

				ship.cellId = cellId;
				ship.coords = [ [row, col], [row, col+1], [row, col+2], [row, col-1] ];
			}
			else {
				gameTable[row][col] = 1;
				gameTable[row+1][col] = 1;
				gameTable[row+2][col] = 1;
				gameTable[row-1][col] = 1;

				ship.cellId = cellId;
				ship.coords = [ [row, col], [row+1, col], [row+2, col], [row-1, col] ];
			}
			break;
		}

		this.printGameTable();
		return true;
	}

	this.deleteShip = function (coords) {
		for (var coord in coords) {
			var c = coords[coord];
			gameTable[c[0]][c[1]] = 0;
		}
	}

	this.rotateShip = function (ship) {

		if ( !$(ship).data("obj").cellId ) {
			$(ship).data("obj").flipDirection();
			return true;
		}

		var tmpCell = $(ship).data("obj").cellId;

		this.deleteShip( $(ship).data("obj").coords );

		if ( $(ship).data("obj").direction == "horizontal" ) {
			$(ship).data("obj").direction = "vertical";

			if ( $(ship).data("obj").length >= 3 ) {
				var coords = tmpCell.split("_");
				if ( parseInt(coords[1]) <= 8 && parseInt(coords[2]) >= 1 ) {
					var row = parseInt(coords[1]) + 1;
					var col = parseInt(coords[2]) - 1;
					tmpCell = coords[0] + "_" + row + "_" + col;
					console.log(tmpCell);
				}
			}
		}
		else {
			$(ship).data("obj").direction = "horizontal";

			if ( $(ship).data("obj").length >= 3 ) {
				var coords = tmpCell.split("_");
				if ( parseInt(coords[1]) >= 1 && parseInt(coords[2]) <= 8 ) {
					var row = parseInt(coords[1]) - 1;
					var col = parseInt(coords[2]) + 1;
					tmpCell = coords[0] + "_" + row + "_" + col;
					console.log(tmpCell);
				}
			}

		}

		var res = this.addShip(tmpCell, $(ship).data("obj"));
		if (res) {
			return true;
		}
		else {
			$(ship).data("obj").flipDirection();
			this.addShip( $(ship).data("obj").cellId, $(ship).data("obj"));
			return false;
		}
	}


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

var client = new Client ();
var ships = [];

$(document).ready(function () {

	$("#game-table-opponent").css("display", "none");

	$("#game-table-ships").css("display", "inline");

	$(".game-table-cell").droppable({
		drop : function (event, ui) {
			var result = client.addShip( $(this).attr("id"), ui.draggable.data("obj") );
			if (!result) {
				$(ui.draggable).css("top", $(ui.draggable).data("top"));
				$(ui.draggable).css("left", $(ui.draggable).data("left"));
			}
			else {
			}
		}

	});

	ships.push( new Ship (1, "horizontal", client) );
	ships.push( new Ship (1, "horizontal", client) );
	ships.push( new Ship (1, "vertical", client) );
	ships.push( new Ship (1, "vertical", client) );

	ships.push( new Ship (2, "horizontal", client) );
	ships.push( new Ship (2, "horizontal", client) );
	ships.push( new Ship (2, "vertical", client) );

	ships.push( new Ship (3, "horizontal", client) );
	ships.push( new Ship (3, "vertical", client) );

	ships.push( new Ship (4, "horizontal", client) );
});


function Ship (length, direction, client) {

	this.length = length;
	this.direction = direction;
	this.client = client;
	this.coords = [];
	this.cellId = null;
	this.element = $("<img>");

	switch (this.length) {

		case 1:
			if (this.direction == "horizontal") 
				this.element.attr("src", SHIPS.SHIP_1_horizontal);
			else
				this.element.attr("src", SHIPS.SHIP_1_vertical);
			break;

		case 2:
			if (this.direction == "horizontal") 
				this.element.attr("src", SHIPS.SHIP_2_horizontal);
			else
				this.element.attr("src", SHIPS.SHIP_2_vertical);
			break;

		case 3:
			if (this.direction == "horizontal")
				this.element.attr("src", SHIPS.SHIP_3_horizontal);
			else
				this.element.attr("src", SHIPS.SHIP_3_vertical);
			break;

		case 4:
			if (this.direction == "horizontal")
				this.element.attr("src", SHIPS.SHIP_4_horizontal);
			else
				this.element.attr("src", SHIPS.SHIP_4_vertical);
			break;

	}

	this.element.draggable({
		snap : ".game-table-cell",
		snapMode: "inner",
		containment: "#game-tablearea",
		start : function (event, ui) {
			$(this).data("top", $(this).css("top"));
			$(this).data("left", $(this).css("left"));
			if ( $(this).data("obj").coords.length > 0 ) {
				$(this).data("obj").client.deleteShip( $(this).data("obj").coords );
				$(this).data("obj").deleteCoords();
			}
		}
	});

	this.element.mousedown(function (event) {
		if (event.which == 2) {
			$(this).data("obj").rotateShip();
		}
	});

	this.element.data("obj", this);
	this.element.css("position", "absolute");

	$("#game-table-ships").append(this.element);

	this.saveCoordinates = function (coords) { this.coords = coords; };

	this.deleteCoords = function () {
		this.coords = [];
		this.cellId = null;
	};

	this.rotateShip = function () {

		var res = this.client.rotateShip(this.element);

		if (res) {
			switch (this.length) {

			case 1:
				if (this.direction == "horizontal")
					this.element.attr("src", SHIPS.SHIP_1_horizontal);
				else
					this.element.attr("src", SHIPS.SHIP_1_vertical);
				break;

			case 2:
				if (this.direction == "horizontal")
					this.element.attr("src", SHIPS.SHIP_2_horizontal);
				else
					this.element.attr("src", SHIPS.SHIP_2_vertical);
				break;

			case 3:
				if (this.direction == "horizontal")
					this.element.attr("src", SHIPS.SHIP_3_horizontal);
				else
					this.element.attr("src", SHIPS.SHIP_3_vertical);
				break;

			case 4:
				if (this.direction == "horizontal")
					this.element.attr("src", SHIPS.SHIP_4_horizontal);
				else
					this.element.attr("src", SHIPS.SHIP_4_vertical);
				break;
			}
		}
	}

	this.flipDirection = function () {
		if (this.direction == "horizontal")
			this.direction = "vertical";
		else
			this.direction = "horizontal";
	}

}


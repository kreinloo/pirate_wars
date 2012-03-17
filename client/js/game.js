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

/*
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
*/
	this.addShip = function (ship, coords) {

		var row = coords["row"];
		var col = coords["col"];
		var length = ship.getLength();
		var direction = ship.getDirection();

		console.log("row: " + row + " col: " + col + " length: " + length + " direction: " + direction);

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
		this.printGameTable();
		return true;

	}

	this.deleteShip = function (ship) {
		var row = ship.getCoords()["row"];
		var col = ship.getCoords()["col"];

		for (var i = 0; i < ship.getLength(); i++) {
			if (ship.getDirection() == "horizontal")
				gameTable[row][col+i] = 0;
			else
				gameTable[row+i][col] = 0;
		}
	}
/*
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
*/
	this.rotateShip = function (ship) {
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

/*
	$(".game-table-cell").droppable({
		drop : function (event, ui) {
			var result = client.addShip( $(this).attr("id"), ui.draggable.data("obj") );
			if (!result) {
				$(ui.draggable).css("top", $(ui.draggable).data("top"));
				$(ui.draggable).css("left", $(ui.draggable).data("left"));
			}
		}

	});
*/
/*
	ships.push( new Ship (1, "horizontal", client) );
	ships.push( new Ship (1, "horizontal", client) );
	ships.push( new Ship (1, "vertical", client) );
	ships.push( new Ship (1, "vertical", client) );

	ships.push( new Ship (2, "horizontal", client) );
	ships.push( new Ship (2, "horizontal", client) );
	ships.push( new Ship (2, "vertical", client) );

	ships.push( new Ship (3, "horizontal", client) );
	ships.push( new Ship (3, "vertical", client) );
*/
	var ship = new Ship (4, "horizontal", client);
	ship.getElement().css("top", 20);
	ship.getElement().css("left", 400);
	ships.push(ship);
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

			if (Object.keys( $(this).data("obj").getCoords() ).length > 0) {
				$(this).data("obj").getClient().deleteShip( $(this).data("obj") );
				$(this).data("obj").clearCoords();
			}
		},
		stop : function (event, ui) {
			var top = parseInt($(this).css("top"));
			var left = parseInt($(this).css("left"));
			if ( $(this).data("obj").direction == "horizontal" ) {
				top -= 12;
				left -= 10;
			}
			else {
				top -= 10;
				left -= 12;
			}
			var res = $(this).data("obj").getClient().addShip(
						$(this).data("obj"), {
							row : parseInt(top / 32),
							col : parseInt(left / 32)
						}
					);
			if (!res) {
				$(this).css("top", $(this).data("top"));
				$(this).css("left", $(this).data("left"));
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

	$("#game-table-user").append(this.element);

	this.saveCoordinates = function (coords) { this.coords = coords; };

	this.deleteCoords = function () {
		this.coords = [];
		this.cellId = null;
	};

	this.rotateShip = function () {

		var res = this.client.rotateShip(this);

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

	this.getClient = function () { return this.client; };

	this.getLength = function () { return this.length; };

	this.getDirection = function () { return this.direction; };

	this.crds = {};

	this.setCoords = function (coords) { this.crds = coords; };

	this.getCoords = function () { return this.crds; };

	this.clearCoords = function () { this.crds = {}; };

	this.getElement = function () { return this.element; };

}


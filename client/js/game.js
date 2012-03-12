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

	return {

		getID : function () { return id; },

		getName : function () { return name; },

		getGameTable : function () { return gameTable; },

		printGameTable : function () {
			for (var i = 0; i < 10; i++)
				console.log (gameTable[i]);
		},

		addShip : function (cellId, ship) {
			
			var coords = cellId.split("_");
			var row = parseInt(coords[1]);
			var col = parseInt(coords[2]);
			var length = parseInt($(ship.draggable).data("obj").length);
			var direction = $(ship.draggable).data("obj").direction;

			console.log("row: " + row + " col: " + col + " length: " + length + " direction: " + direction);

			switch (length) {

			case 1:
				if (gameTable[row][col] == 0) {
					gameTable[row][col] = 1;
					this.printGameTable();
					return [ [row, col] ];
				}
				else {
					this.printGameTable();
					return [];
				}
				break;

			case 2:

				if (direction == "horizontal") {
					if (gameTable[row][col] == 0 && col+1 <= 9 && gameTable[row][col+1] == 0) {
						gameTable[row][col] = 1;
						gameTable[row][col+1] = 1;
						this.printGameTable();
						return [ [row, col], [row, col+1] ];
					}
					else {
						this.printGameTable();
						return [];
					}
				}

				else {
					if (gameTable[row][col] == 0 && row+1 <= 9 && gameTable[row+1][col] == 0) {
						gameTable[row][col] = 1;
						gameTable[row+1][col] = 1;
						this.printGameTable();
						return [ [row, col], [row+1, col] ];
					}
					else {
						this.printGameTable();
						return [];
					}
				}
				break;

			case 3:

				if (direction == "horizontal") {
					if (gameTable[row][col] == 0 && col+1 <= 9 && gameTable[row][col+1] == 0 &&
						col-1 >= 0 && gameTable[row][col-1] == 0) {

						gameTable[row][col] = 1;
						gameTable[row][col+1] = 1;
						gameTable[row][col-1] = 1;
						this.printGameTable();
						return [ [row, col], [row, col+1], [row, col-1] ];
					}
					else {
						this.printGameTable();
						return [];
					}
				}

				else {
					if (gameTable[row][col] == 0 && row+1 <= 9 && gameTable[row+1][col] == 0 &&
						row-1 >= 0 && gameTable[row-1][col] == 0) {

						gameTable[row][col] = 1;
						gameTable[row+1][col] = 1;
						gameTable[row-1][col] = 1;
						this.printGameTable();
						return [ [row, col], [row+1, col], [row-1, col] ];
					}
					else {
						this.printGameTable();
						return [];
					}
				}

				break;

			case 4:

				if (direction == "horizontal") {
					if (gameTable[row][col] == 0 &&
						col+1 <= 9 && gameTable[row][col+1] == 0 &&
						col+2 <= 9 && gameTable[row][col+2] == 0 &&
						col-1 >= 0 && gameTable[row][col-1] == 0) {

						gameTable[row][col] = 1;
						gameTable[row][col+1] = 1;
						gameTable[row][col+2] = 1;
						gameTable[row][col-1] = 1;

						this.printGameTable();
						return [ [row, col], [row, col+1], [row, col+2], [row, col-1] ];
					}
					else {
						this.printGameTable();
						return [];
					}
				}

				else {
					if (gameTable[row][col] == 0 &&
						row+1 <= 9 && gameTable[row+1][col] == 0 &&
						row+2 <= 9 && gameTable[row+2][col] == 0 &&
						row-1 >= 0 && gameTable[row-1][col] == 0) {

						gameTable[row][col] = 1;
						gameTable[row+1][col] = 1;
						gameTable[row+2][col] = 1;
						gameTable[row-1][col] = 1;

						this.printGameTable();
						return [ [row, col], [row+1, col], [row+2, col], [row-1, col] ];
					}
					else {
						this.printGameTable();
						return [];
					}

				}

				break;

			}

		},

		deleteShip : function (coords) {

			console.log("deleting coords: ");
			console.log(coords);
			for (var coord in coords) {
				var c = coords[coord];
				gameTable[c[0]][c[1]] = 0;
			}

		},

		rotateShip : function (cellId, ship) {

			console.log(cellId);

		}
	}

};

var SHIPS = {

	SHIP_1_horizontal : "gfx/SHIP_1.png",
	SHIP_1_vertical : "gfx/SHIP_1.png",

	SHIP_2_horizontal : "gfx/SHIP_2.png",
	SHIP_2_vertical : "gfx/SHIP_2.png",

	SHIP_3_horizontal : "gfx/SHIP_3.png",
	SHIP_3_vertical : "gfx/SHIP_3.png",

	SHIP_4_horizontal : "gfx/SHIP_4_horizontal.png",
	SHIP_4_vertical : "gfx/SHIP_4_vertical.png"

};

var client = new Client ();
var ships = [];

$(document).ready(function () {

	$("#game-table-opponent").css("display", "none");

	$("#game-table-ships").css("display", "inline");

/*
	$("#game-table-ships").append(
		$("<img>").attr("src", SHIPS.SHIP_1_horizontal).
				data("ship-length", 1).
				data("direction", "horizontal").
				draggable({
					snap : ".game-table-cell",
					snapMode: "inner",
					containment: "#game-tablearea" })
	);

	$("#game-table-ships").append(
	$("<img>").attr("src", SHIPS.SHIP_2_horizontal).
				data("ship-length", 2).
				data("direction", "horizontal").
				draggable({
					snap : ".game-table-cell",
					snapMode: "inner",
					containment: "#game-tablearea" })
	);

	$("#game-table-ships").append(
	$("<img>").attr("src", SHIPS.SHIP_3_horizontal).
				data("ship-length", 3).
				data("direction", "horizontal").
				draggable({
					snap : ".game-table-cell",
					snapMode: "inner",
					containment: "#game-tablearea" })
	);

	$("#game-table-ships").append(
	$("<img>").attr("src", SHIPS.SHIP_4_horizontal).
				data("ship-length", 4).
				data("direction", "horizontal").
				draggable({
					snap : ".game-table-cell",
					snapMode: "inner",
					containment: "#game-tablearea",

					start : function (event, ui) {

						$(this).data("top", $(this).css("top"));
						$(this).data("left", $(this).css("left"));
					
					}})
	);
*/

	$(".game-table-cell").droppable({
		drop : function (event, ui) {
			var result = client.addShip( $(this).attr("id"), ui );
			if (result.length == 0) {
				$(ui.draggable).css("top", $(ui.draggable).data("top"));
				$(ui.draggable).css("left", $(ui.draggable).data("left"));
			}
			else {
				$(ui.draggable).data("obj").saveCoordinates(result);
			}
		}

	})

	ships.push( new Ship (1, "horizontal", client) );
	ships.push( new Ship (2, "horizontal", client) );
	ships.push( new Ship (3, "horizontal", client) );
	ships.push( new Ship (4, "horizontal", client) );
});


function Ship (length, direction, client) {

	this.length = length;
	this.direction = direction;
	this.client = client;
	this.coords = [];

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
	}});

	this.element.data("obj", this);

	$("#game-table-ships").append(this.element);

	this.saveCoordinates = function (coords) {
		this.coords = coords;
	};

	this.deleteCoords = function () { this.coords = []; };

}


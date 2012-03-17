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

		addShip : function (ship, coords) {

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

	var ship1 = new Ship (1, "horizontal", client);
	ship1.getElement().css("top", 20);
	ship1.getElement().css("left", 400);

	var ship2 = new Ship (2, "horizontal", client);
	ship2.getElement().css("top", 60);
	ship2.getElement().css("left", 400);

	var ship3 = new Ship (3, "horizontal", client);
	ship3.getElement().css("top", 100);
	ship3.getElement().css("left", 400);

	var ship4 = new Ship (4, "horizontal", client);
	ship4.getElement().css("top", 140);
	ship4.getElement().css("left", 400);

	ships.push(ship1);
	ships.push(ship2);
	ships.push(ship3);
	ships.push(ship4);
});

function Ship (len, dir, clnt) {

	var length = len;
	var direction = dir;
	var client = clnt;
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
				$(this).data("obj").getClient().deleteShip( $(this).data("obj") );
				$(this).data("obj").clearCoords();
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

	element.mousedown(function (event) {
		if (event.which == 2) {
			$(this).data("obj").rotateShip();
		}
	});

	element.data("obj", this);
	element.css("position", "absolute");

	$("#game-table-user").append(element);

	//this.getCoords = function () { return coords; };

	//this.getDirection = function () { return direction; };

	//this.getClient = function () { return client; };

	//this.getLength = function () { return length; };

	return {

		rotateShip : function () {

			var res = getClient().rotateShip(this);

			if (res) {
				switch (getLength()) {

				case 1:
					if (getDirection() == "horizontal")
						getElement().attr("src", SHIPS.SHIP_1_horizontal);
					else
						getElement().attr("src", SHIPS.SHIP_1_vertical);
					break;

				case 2:
					if (getDirection() == "horizontal")
						getElement().attr("src", SHIPS.SHIP_2_horizontal);
					else
						getElement().attr("src", SHIPS.SHIP_2_vertical);
					break;

				case 3:
					if (getDirection() == "horizontal")
						getElement().attr("src", SHIPS.SHIP_3_horizontal);
					else
						getElement().attr("src", SHIPS.SHIP_3_vertical);
					break;

				case 4:
					if (getDirection() == "horizontal")
						getElement().attr("src", SHIPS.SHIP_4_horizontal);
					else
						getElement().attr("src", SHIPS.SHIP_4_vertical);
					break;
				}
			}
		},

		flipDirection : function () {
			if (this.direction == "horizontal")
				this.direction = "vertical";
			else
				this.direction = "horizontal";
		},

		getClient : function () { return client; },

		getLength : function () { return length; },

		getDirection : function () { return direction; },

		setCoords : function (newCoords) { coords = newCoords; },

		getCoords : function () { return coords; },

		clearCoords : function () { coords = {}; },

		getElement : function () { return element; }

	}

}


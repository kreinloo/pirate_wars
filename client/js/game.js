/*

	game.js

*/

function Player () {

	var id;
	var name;
	var gameTable;
	//var ships = [];

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

			console.log("row: " + row + " col: " + col + " length: " +
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
			//this.printGameTable();
			//ships.push(ship);
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
		},

		clearTable : function () {
			gameTable = null;
			gameTable = new Array(10);
			for (var i = 0; i < 10; i++) {
				gameTable[i] = new Array(10);
				for (var j = 0; j < 10; j++)
					gameTable[i][j] = 0;
			}
			//ships = [];
		},

		confirmShipCount : function () {
			var v = 0;
			for (var i = 0; i < 10; i++) {
				for (var j = 0; j < 10; j++) {
					v += gameTable[i][j];
				}
			}
			//if (v == 20 && ships.length == 10)
			if (v == 20)
				return true;
			else
				return false;
		},

		//getShips : function () { return ships; },

		lockShips : function () { $(".game-table-ship").draggable("disable"); }

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

var player = new Player ();

$(document).ready(function () {

	$("#game-table-opponent").css("display", "none");
	$("#game-table-ships").css("display", "inline");

	$("#game-table-ships-confirm").click(function () {
		console.log("confirm button clicked");
		if (!player.confirmShipCount()) {
			console.log("all ships have not been placed to table");
		} else {
			console.log("all ships are placed");
			$("#game-table-ships").remove();
			$("#game-table-opponent").css("display", "block");
			player.lockShips();
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
				$(this).data("obj").getPlayer().deleteShip( $(this).data("obj") );
				//$(this).data("obj").clearCoords();
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
				res = $(this).data("obj").getPlayer().addShip(
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
					$(this).data("obj").getPlayer().addShip($(this).data("obj"),
						$(this).data("obj").getCoords());
			}
			$(this).data("obj").getPlayer().printGameTable();
		}
	});

	element.dblclick(function () {
		$(this).data("obj").rotateShip();
	});

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

		getPlayer : function () { return player; },

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


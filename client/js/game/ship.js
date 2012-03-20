/*

	ship.js

*/

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

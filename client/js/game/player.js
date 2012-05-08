/*

	player.js

*/

var Player = (function (serverInterface) {

	"use strict";

	var server = serverInterface;
	var gameTable;
	var opponentTable;
	var tableConfirmed = false;

	var i, j;
	gameTable = new Array(10);
	for (i = 0; i < 10; i++) {
		gameTable[i] = new Array(10);
		for (j = 0; j < 10; j++)
			gameTable[i][j] = 0;
	}

	opponentTable = new Array(10);
	for (i = 0; i < 10; i++) {
		opponentTable[i] = new Array(10);
		for (j = 0; j < 10; j++)
			opponentTable[i][j] = 0;
	}

	return {

		getGameTable : function () { return gameTable; },

		printGameTable : function () {
			for (var i = 0; i < 10; i++)
				console.log (gameTable[i]);
		},

		addShip : function (ship, coords) {
			var row = coords.row;
			var col = coords.col;
			var length = ship.getLength();
			var direction = ship.getDirection();

			if (direction === "horizontal") {
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

			if (direction === "horizontal") {
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
					if (gameTable[i][j] !== 0)
						return false;
				}
			}

			for (i = 0; i < length; i++) {
				if (direction === "horizontal")
					gameTable[row][col+i] = 1;
				else
					gameTable[row+i][col] = 1;
			}

			ship.setCoords(coords);

			if (direction === "horizontal"){
				server.addHorizontalShip(row,col,length);
			}
			else if (direction === "vertical"){
				server.addVerticalShip(row,col,length);
			}
			ui.sound.playEffect("PLACE_SHIP");
			return true;
		},

		deleteShip : function (ship) {
			var row = ship.getCoords().row;
			var col = ship.getCoords().col;

			for (var i = 0; i < ship.getLength(); i++) {
				if (ship.getDirection() === "horizontal")
					gameTable[row][col+i] = 0;
				else
					gameTable[row+i][col] = 0;
			}
			// Communicate to Server that we want to delete a ship
			server.deleteShip(row,col);
		},

		rotateShip : function (ship) {
			if (Object.keys(ship.getCoords()).length === 0) {
				ship.flipDirection();
				ui.sound.playEffect("ROTATE_SHIP");
				return true;
			}

			var coords = ship.getCoords();

			this.deleteShip(ship);
			ship.flipDirection();
			var res = this.addShip(ship, coords);

			if (res) {
				ui.sound.playEffect("ROTATE_SHIP");
				return true;
			} else {
				ship.flipDirection();
				this.addShip(ship, coords);
				return false;
			}
		},

		resetField : function () {
			server.resetField();
		},

		// server will say if we really can reset
		// our game table
		resetFieldConfirmed : function () {
			// gameTable reset
			var i, j;
			gameTable = null;
			gameTable = new Array(10);
			for (i = 0; i < 10; i++) {
				gameTable[i] = new Array(10);
				for (j = 0; j < 10; j++)
					gameTable[i][j] = 0;
			}
			this.log("Double click on a ship rotates is 90 degrees.");

			// removing all ships and creating new ones
			ui.game.removeShips();
			var shipFactory = new ShipFactory();
			var left = 360;
			var top = 10;
			var ship = null;
			for (i = 0; i < 4; i++) {
				ship = shipFactory.createShip(1, "horizontal", this);
				ship.getElement().css("top", top);
				ship.getElement().css("left", left);
				left += 35;
			}
			left = 360;
			top += 40;

			for (i = 0; i < 3; i++) {
				ship = shipFactory.createShip(2, "horizontal", this);
				ship.getElement().css("top", top);
				ship.getElement().css("left", left);
				left += 70;
			}
			left = 360;
			top += 40;

			for (i = 0; i < 2; i++) {
				ship = shipFactory.createShip(3, "horizontal", this);
				ship.getElement().css("top", top);
				ship.getElement().css("left", left);
				left += 105;
			}
			left = 360;
			top += 40;

			ship = shipFactory.createShip(4, "horizontal", this);
			ship.getElement().css("top", top);
			ship.getElement().css("left", left);

		},

		confirmShipCount : function () {
			var v = 0;
			for (var i = 0; i < 10; i++) {
				for (var j = 0; j < 10; j++) {
					v += gameTable[i][j];
				}
			}
			if (v === 20)
				return true;
			else
				return false;
		},

		opponentsTurn : function (data) {
			var result = data.params.result;
			var row = data.params.row;
			var col = data.params.col;
			switch (result) {
				case 10 :
					ui.sound.playEffect("HIT_WATER");
					setTimeout( function () { ui.game.placeExplosion(true,row,col,TILE.WATER_EXPLOSION); },700);
					setTimeout( function () {ui.game.drawTile(true,row,col,TILE.SPLASH,false) ;}, 1700);
					this.log(server.getOpponentName() + " missed ...");
					break;
				case 11 :
					ui.sound.playEffect("HIT_SHIP");
					setTimeout( function () { ui.game.placeExplosion(true,row,col,TILE.EXPLOSION); }, 400);
					setTimeout( function () {ui.game.drawTile(true,row,col,TILE.FIRE,false) ;}, 1400);
					this.log(server.getOpponentName() + " hit our ship!");
					break;
				case 12 :
					ui.sound.playEffect("SHIP_SINK");
					setTimeout( function () { ui.game.placeExplosion(true,row,col,TILE.EXPLOSION); }, 400);
					setTimeout( function () {ui.game.drawTile(true,row,col,TILE.FIRE,false) ;}, 1400);
					this.log(server.getOpponentName() + " sank our ship!");
					break;
				case 13 :
					ui.sound.playEffect("SHIP_SINK");
					setTimeout( function () { ui.game.placeExplosion(true,row,col,TILE.EXPLOSION); }, 400);
					setTimeout( function () {ui.game.drawTile(true,row,col,TILE.FIRE,false) ;}, 1400);
					this.removeListenerFromOpponentCells();
					this.log("SIRE! SIRE! We have no ships left. RETREAAAT!!");
					break;
			}
		},

		findDirectionAndLength : function(row, col) {
			var horizontal; // boolean , true if ship is horizontal
			var vertical; // boolean, true id ship is vertical
			var rowCord = row; // row coordinate for start of the drawing
			var colCord = col; // column coordinate for start of the drawing
			var i;
			if (row !== 0 && row !== 9 ) // check if we are horizontally on the edge.
				horizontal = opponentTable[row+1][col] != FIELD.SHIP_SHOT &&
				opponentTable[row-1][col] != FIELD.SHIP_SHOT;
			else if (row === 0)
				horizontal = opponentTable[row+1][col]!=FIELD.SHIP_SHOT ? true:false;

			else if (row == 9)
				horizontal = opponentTable[row-1][col]!=FIELD.SHIP_SHOT ? true:false;

			// by this point horizontal can be true only if a cell above or below pointed cell
			// is 1.
			if (col !== 0 && col !== 9 )
				vertical = opponentTable[row][col+1] !=FIELD.SHIP_SHOT &&
				opponentTable[row][col-1] !=FIELD.SHIP_SHOT ? true : false;
			else if (col === 0)
				vertical = opponentTable[row][col+1]!=FIELD.SHIP_SHOT ? true:false;

			else if (col == 9)
				vertical = opponentTable[row][col-1]!=FIELD.SHIP_SHOT ? true:false;
			// by this point vertical can be true only if a cell to left or cell to right is 1.
			// now we can start calculating the length of the ship.
			var length = 1 ;// minimum length
			if (vertical && horizontal) {
				return [row,col,1,false];
			}
			if (horizontal) {
				// check Horizontally to the right
				for (i = 1; i<4;i++){
					if (col+ i <=9){
						if (opponentTable[row][col+i] == FIELD.SHIP_SHOT)
							length ++ ;
						else break;
					}
					else break;
				}
				// check Horizontally to the left
				for (i = 1; i<4;i++) {
					if (col - i >= 0){
						if (opponentTable[row][col-i] == FIELD.SHIP_SHOT) {
							length ++ ;
							colCord-- ;
						}
						else break;
					}
					else break;
				}
			}
			if (vertical) {
				// check vertivally to the downward
				for (i = 1; i<4;i++) {
					if (row + i <= 9) {
						if (opponentTable[row+i][col] == FIELD.SHIP_SHOT)
							length ++ ;
						else break;
					}
					else break;
				}
				// check vertically upward
				for (i = 1; i<4;i++) {
					if (row - i >= 0) {
						if (opponentTable[row-i][col] == FIELD.SHIP_SHOT) {
							length ++ ;
							rowCord --;
						}
						else break;
					}
					else break;
				}
			}
			// By now we know the direction and the length of the ship ..
			return [rowCord,colCord,length,horizontal ? 1:0];

		},

		makeMove : function (row, col) {
			server.fireAt(row ,col);
		},

		lockShips : function () {
			ui.game.lockShips();
			tableConfirmed = true;
		},

		removeListenerFromOpponentCells : function () {
			ui.game.removeListenerFromOpponentCells();
		},

		confirmAlignment : function () {
			// Signal the server that we are ready to start the game.
			server.confirmAlignment();
		},

		log : function (message, author) {
			ui.game.log(message, author);
		},

		emitPrivateMessage : function (message) {
			serverInterface.emitPrivateMessage(message);
		},

		fireAtResponse : function (data) {

			var outcome = data.params.result;
			var row = data.params.row;
			var col = data.params.col;
			ui.game.removeFog(row,col);
			switch (outcome) {
				case HIT.WATER :// reveal fog on that tile
					ui.sound.playEffect("HIT_WATER");
					setTimeout( function () { ui.game.placeExplosion(false,row,col,TILE.WATER_EXPLOSION); }, 700);
					setTimeout( function () { ui.game.drawTile(false,row,col,TILE.SPLASH,false); },1700);
					this.log("You missed ...");
					opponentTable[row][col] = FIELD.WATER_SHOT;
					break;
				case HIT.SHIP : //reveal fog on that tile
					ui.sound.playEffect("HIT_SHIP");
					setTimeout( function () { ui.game.placeExplosion(false,row,col,TILE.EXPLOSION); }, 400);
					setTimeout( function () {ui.game.drawTile(false,row,col,TILE.FIRE,false) ;}, 1400);
					this.log("You hit ship ...");
					opponentTable[row][col] = FIELD.SHIP_SHOT;
					break;
				case HIT.WHOLE_SHIP : //reveal fog,
					ui.sound.playEffect("SHIP_SINK");
					setTimeout( function () { ui.game.placeExplosion(false,row,col,TILE.EXPLOSION); }, 400);
					setTimeout( function () {ui.game.drawTile(false,row,col,TILE.FIRE,false) ;}, 1400);
					this.log("You sank " + server.getOpponentName() + "'s ship!");
					opponentTable[row][col] = FIELD.SHIP_SHOT;
					var list = this.findDirectionAndLength(row, col);
					console.log(list);
					var Rotation = list[3]==1 ;
					var shipLength = list[2];
					switch (shipLength){ // case number represents the length of the ship.
						case 1:
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_1_horizontal,false);
							break;
						case 2:
							if (Rotation){
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_2_horizontal,false);
							}
							else {
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_2_vertical,false);
							}
							break;
						case 3:
							if (Rotation){
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_3_horizontal,false);
							}
							else {
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_3_vertical,false);
							}
							break;
						case 4:
							if (Rotation){
							console.log (Rotation);
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_4_horizontal,false);
							}
							else {
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_4_vertical,false);
							}
							break;
					}
					break;

				case HIT.GAME_OVER :
					ui.sound.playEffect("SHIP_SINK");
					opponentTable[row][col] = FIELD.SHIP_SHOT;
					setTimeout( function () { ui.game.placeExplosion(false,row,col,TILE.EXPLOSION); }, 400);
					setTimeout( function () {ui.game.drawTile(false,row,col,TILE.FIRE,false) ;}, 1400);
					this.log("You sank " + server.getOpponentName() + "'s last ship");
					list = this.findDirectionAndLength(row, col);
					Rotation = list[3] == 1;
					shipLength = list[2];
					switch (shipLength){ // case number represents the length of the ship.
						case 1:
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_1_horizontal,false);
							break;
						case 2:
							if (Rotation){
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_2_horizontal,false);
							}
							else {
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_2_vertical,false);
							}
							break;
						case 3:
							if (Rotation){
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_3_horizontal,false);
							}
							else {
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_3_vertical,false);
							}
							break;
						case 4:
							if (Rotation){
							console.log (Rotation);
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_4_horizontal,false);
							}
							else {
							ui.game.drawTile(false,list[0],list[1],
								SHIPS.SHIP_4_vertical,false);
							}
							break;
					}
					this.removeListenerFromOpponentCells();
					break;

			}

		},

		loadBattlePhase : function () {
			ui.sound.playEffect("START_BATTLE");
			ui.sound.playMusic("BATTLE");
			ui.game.loadBattlePhase(this);
		},

		confirmButtonClicked : function () {
			if (!this.confirmShipCount()) {
				console.log("all ships have not been placed to table");
				this.log("Please place all your ships to the table on the left.");
			} else {
				console.log(
					"all ships have been placed, asking confirmation from the server");
				this.confirmAlignment();
			}
		},

		resetButtonClicked : function () {
			this.resetField();
		},

		chatFormSubmitted : function (data) {
			this.emitPrivateMessage(data);
		}

	};

});

var ERROR = {
	// Dummy (probably not used)
	NONE: 0,
	// The move isn't legal (invalid coordinates for example)
	INVALID_MOVE: 1,
	// Player has already fired on that cell
	REPEATED_MOVE: 2,
	// It's not player's turn to fire
	WRONG_TURN: 3,
	// It's not possible to do that in current game phase
	INVALID_PHASE: 4
};

// Represents result of firing
var HIT = {
	// Hit the water
	WATER: 10,
	// Hit tile of enemy ship
	SHIP: 11,
	// Hit tile of enemy ship that was also last part of it
	WHOLE_SHIP: 12,
	// Hit last tile of last ship - won
	GAME_OVER: 13
};

var FIELD = {
	WATER_NOT_SHOT : 0,
	WATER_SHOT : 1,
	SHIP_NOT_SHOT : 2,
	SHIP_SHOT : 3
};

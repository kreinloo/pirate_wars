/*
	ReplayManager saves / reads / plays games.
*/
var ReplayManager = (function (clientID) {

	this.pid = clientID;

	this.saveGame = function (data) {
		var gameHistory;
		data.date = new Date();
		if (localStorage.gameHistory === undefined || localStorage.gameHistory === null) {
			gameHistory = {};
			gameHistory[data.pid] = [];
			gameHistory[data.pid].push(data);
			localStorage.gameHistory = JSON.stringify(gameHistory);
		} else {
			gameHistory = JSON.parse(localStorage.gameHistory);
			if (gameHistory[data.pid] === undefined || gameHistory[data.pid] === null)
				gameHistory[data.pid] = [];
			gameHistory[data.pid].push(data);
			localStorage.gameHistory = JSON.stringify(gameHistory);
		}

	};

	this.playGame = function (gid) {
		console.log("playing game: " + gid);
		if (localStorage.gameHistory === undefined || localStorage.gameHistory === null)
			return;
		var gameHistory = JSON.parse(localStorage.gameHistory);
		if (gameHistory[this.pid] === undefined || localStorage.gameHistory[this.pid] === null)
			return;

		var games = gameHistory[this.pid];
		var game = null;
		for (var i = 0; i < games.length; i++) {
			if (games[i].gid === gid) {
				game = games[i];
				break;
			}
		}
		if (game === null)
			return;

		ui.load("game");
		ui.game.initialize();
		ui.game.loadBattlePhase();
		var player = new Player(new ReplayServerInterface(game.opponent));

		var ship, ships, obj;
		ships = game.ships;
		for (i in ships) {
			ship = ships[i];
			obj = new Ship(ship.len, ship.dir, player);
			if (ship.dir === "horizontal") {
				obj.getElement().css("left", ship.col * 32 + 10);
				obj.getElement().css("top", ship.row * 32 + 12);
			} else {
				obj.getElement().css("left", ship.col * 32 + 12);
				obj.getElement().css("top", ship.row * 32 + 10);
			}
		}
		player.lockShips();

		var moves = game.moves.reverse();
		var move;
		var intervalID = setInterval(function () {
			if (moves.length > 0) {
				move = moves.pop();
				if (move.player === "player")
					player.fireAtResponse({ params: {
						col : move.col,
						row : move.row,
						result : move.result
					}});
				else
					player.opponentsTurn({ params: {
						col : move.col,
						row : move.row,
						result : move.result
					}});
			} else {
				clearInterval(intervalID);
				(function () {
					ui.dialog("endgame", {
						title : "Replay completed!",
						msg : "Replay completed! Click OK to return to replay section.",
						callback : function () {
							ui.game.finalize();
							ui.load("replay");
						}
					});
				}());
			}
		}, 750);

	};

	this.getGameEntries = function () {
		if (localStorage.gameHistory === undefined || localStorage.gameHistory === null)
			return [];

		var gameHistory = JSON.parse(localStorage.gameHistory);
		if (gameHistory[this.pid] === undefined || localStorage.gameHistory[this.pid] === null)
			return [];

		var games = gameHistory[this.pid];
		return games;
	};

});

/*
	Player calls server.getOpponentName() method while parsing results, so this
	object offers the oppnent's name.
*/
var ReplayServerInterface = (function (name) {

	this.getOpponentName = function () { return name; };

});

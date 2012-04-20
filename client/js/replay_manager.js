var ReplayManager = (function () {

	this.saveGame = function (data) {
		var gameHistory;
		data.date = new Date();
		if (localStorage.gameHistory === undefined) {
			gameHistory = {};
			gameHistory[data.pid] = [];
			gameHistory[data.pid].push(data);
			localStorage.gameHistory = JSON.stringify(gameHistory);
		} else {
			gameHistory = JSON.parse(localStorage.gameHistory);
			if (gameHistory[data.pid] === undefined)
				gameHistory[data.pid] = [];
			gameHistory[data.pid].push(data);
			localStorage.gameHistory = JSON.stringify(gameHistory);
		}

	};

	this.playGame = function (gid) {};

	this.getGameEntries = function (pid) {
		if (localStorage.gameHistory === undefined)
			return [];

		var gameHistory = JSON.parse(localStorage.gameHistory);
		if (gameHistory[pid] === undefined)
			return [];

		var games = gameHistory[pid];
		return games;
	};

});

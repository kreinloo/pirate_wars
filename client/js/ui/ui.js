/*

	ui.js

*/

var UI = (function () {

	"use strict";
	this.lobby = null;
	this.lobbyContent = null;
	this.game = null;
	this.gameContent = null;
	this.scoreboard = null;
	this.scoreboardContent = null;
	this.sound = null;
	this.replay = null;
	this.replayContent = null;
	var self = this;

	this.load = function (view) {
		if (view === "login") {
			console.log("ui: loading login view");
			$("#login-form").submit(function() {
				if ($("#login-form-username").val().length < 3) {
					self.dialog("custom", {
						title : "Login",
						msg: "Username must be longer than 2 characters."});
				} else {
					var id = $("#login-form-username").val();
					console.log(id);
					Client.connect(id);
				}
				return false;
			});
		}

		else if (view === "lobby") {
			console.log("ui: loading lobby view");
			$("#content").children().hide(0, function () {
				if (self.lobbyContent === null) {
					$.ajax({
						url : "lobby.html",
						cache : false,
						async : false
					}).done(function (html) {
						$("#content").append(html);
						self.lobbyContent = $("#lobby");
						self.lobby.addListenersToButtons();
					});
				} else {
					self.lobbyContent.show();
				}
			});
			this.loadLobbyMenu();
		}

		else if (view === "game") {
			console.log("ui: loading game view");
			$("#content").children().hide(0, function () {
				if (self.gameContent === null) {
					$.ajax ({
						url : "game.html",
						cache : false,
						async : false
					}).done(function (html) {
						$("#content").append(html);
					});
					self.gameContent = $("#game");
				} else {
					self.gameContent.show();
				}
			});
		}

		else if (view === "scoreboard") {
			console.log("ui: loading scoreboard view");
			$("#content").children().hide(0, function () {
				if (self.scoreboardContent === null) {
					$.ajax ({
						url : "scoreboard.html",
						cache : false,
						async : false
					}).done(function (html) {
						$("#content").append(html);
					});
					self.scoreboardContent = $("#scoreboard");
				} else {
					self.scoreboardContent.show();
				}
			});
			Client.requestScoreboard();
			Client.joinScoreboard();
			this.loadBackToLobbyMenu(function () {
				Client.leaveScoreboard();
			});
		}

		else if (view === "replay") {
			console.log("ui: loading replay view");
			$("#content").children().hide(0, function () {
				if (self.replayContent === null) {
					$.ajax ({
						url : "replay.html",
						cache : false,
						async : false
					}).done(function (html) {
						$("#content").append(html);
					});
					self.replayContent = $("#replay");
				} else {
					self.replayContent.show();
				}
			});
			this.loadBackToLobbyMenu();
			this.replay.populateTable(
				Client.getReplayManager().getGameEntries());
		}

	};

	this.dialog = function (dialog, data) {

		if (dialog === "endgame") {
			this.dialog("custom", data);
		}

		if (dialog === "custom") {
			$("<div>").
				append("<p>" + data.msg + "</p>").
				dialog({
					resizable : false,
					height : 200,
					modal : true,
					buttons : {
						"OK" : function () {
							$(this).dialog("close");
						}
					},
					title : data.title,
					close : function (event, ui) {
						if (data.callback !== undefined &&
							typeof data.callback === "function")
							data.callback();
					}
				});
			return;
		}

	};

	this.loadScripts = function () {
			this.loadScript("js/events.js");
			this.loadScript("js/ui/lobby.js");
			this.loadScript("js/ui/game.js");
			this.loadScript("js/game/ship.js");
			this.loadScript("js/game/player.js");
			this.loadScript("js/game/server_interface.js");
			this.loadScript("js/game/sound.js");
			this.loadScript("js/client.js");
			this.loadScript("js/ui/scoreboard.js");
			this.loadScript("js/ui/replay.js");
			this.loadScript("js/replay_manager.js");
			this.loadScript("js/client.js");
			this.scriptsLoaded = true;
			this.lobby = new Lobby();
			this.game = new Game();
			this.scoreboard = new Scoreboard();
			this.sound = new Sound();
			this.replay = new Replay();
	};

	this.loadScript = function (file) {
		$.ajax({
			url : file,
			dataType : "script",
			async : false
		});
	};

	this.loadLobbyMenu = function () {
		$(".menu-items").children().remove();
		$(".menu-items").append(
			$("<a>").
				attr("href", "#").
				attr("id", "menu-item-scoreboard").
				addClass("menu-item").
				append("scoreboard").
				click(function () { self.load("scoreboard"); return false; })
		);
		$(".menu-items").append(
			$("<a>").
				attr("href", "#").
				attr("id", "menu-item-replay").
				addClass("menu-item").
				append("replay").
				click(function () { self.load("replay"); return false; })
		);
	};

	this.loadBackToLobbyMenu = function (callback) {
		$(".menu-items").children().remove();
		$(".menu-items").append(
			$("<a>").
				attr("href", "#").
				attr("id", "menu-item-lobby").
				addClass("menu-item").
				append("back to lobby").
				click(function () {
					if (callback !== undefined && typeof callback === "function")
						callback.call();
					self.load("lobby");
					return false;
				})
		);
	};

	this.loadScripts();
	Client.initParams();

});

var ui = new UI();

$(document).ready(function () {
	ui.load("login");
});

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
	this.creditsContent = null;
	this.loginContent = null;
	this.currentView = null;
	var self = this;

	this.load = function (view) {
		if (view === "login") {
			console.log("ui: loading login view");
			if (self.loginContent === null) {
				self.loginContent = $("#login");
			}
			else {
				$("#content").children().hide();
				self.loginContent.show();
			}
		}

		else if (view === "lobby") {
			console.log("ui: loading lobby view");
			$("#content").children().hide(0, function () {
				if (self.lobbyContent === null) {
					ui.sound.playMusic("LOBBY");
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
			this.loadBackToLobbyMenu(function () {
				Client.quitGame();
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

		else if (view === "credits") {
			console.log("ui: loading credits view");
			$("#content").children().hide(0, function () {
				if (self.creditsContent === null) {
					$.ajax ({
						url : "credits.html",
						cache : false,
						async : false
					}).done(function (html) {
						$("#content").append(html);
					});
					self.creditsContent = $("#credits");
				} else {
					self.creditsContent.show();
				}
			});
			this.loadBackFromCredits(this.currentView);
		}

		this.currentView = view;
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
			this.loadScript("js/ui/sound.js");
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

	this.loadFooter = function (callback) {
		$("#footer").append(
				$("<img>").
					//attr("type", "button").
					attr("type", "img").
					attr("id", "music-mute").
					attr("value", "Mute music").
					attr("src", BUTTONS.SOUND_MUSIC_ACTIVE).
					addClass("footer-item").
					click(function () {

						if (ui.sound.getMusicMute() == false){
							ui.sound.setMuteMusic(true);
							$("#music-mute").attr("src",BUTTONS.SOUND_MUSIC_MUTED);
						}
						else{
							ui.sound.setMuteMusic(false);
							$("#music-mute").attr("src",BUTTONS.SOUND_MUSIC_ACTIVE);
						}
					})
		)
		.append(
			$("<img>").
				//attr("type", "button").
				attr("id", "effects-mute").
				attr("value", "Mute effect").
				attr("src", BUTTONS.SOUND_FX_ACTIVE).
				addClass("footer-item").
				click(function () {
					if (ui.sound.getMuteEffects() == false){
						ui.sound.setMuteEffects(true);
						$("#effects-mute").attr("src",BUTTONS.SOUND_FX_MUTED);
					}
					else {
						ui.sound.setMuteEffects(false);
						$("#effects-mute").attr("src",BUTTONS.SOUND_FX_ACTIVE);
					}
				})
		)
			.append(
				$("<a>").
					attr("href", "#").
					attr("id", "footer-item-credits").
					addClass("footer-item").
					//addClass("footer-credit").
					append("Those who sacrificed themselves for the cause.").
					click(function () {
						if (callback !== undefined && typeof callback === "function")
							callback.call();
						self.removeFooter();
						self.load("credits");
						return false;
					})
		);
	};

	this.removeFooter = function () {
		$("#footer").children().remove();
	};

	this.loadBackFromCredits = function (destination) {
		$(".menu-items").children().remove();
		$(".menu-items").append(
			$("<a>").
				attr("href", "#").
				addClass("menu-item").
				append("return").
				click(function () {
					$(".menu-items").children().remove();
					self.loadFooter();
					self.load(destination);
					return false;
				})
		);
	};

	this.loadScripts();
	Client.initParams();

});

var ui = new UI();

$(document).ready(function () {
	ui.loadFooter();
	ui.load("login");
});

/*
	Moved FB login code here, I did not create a new js file
	in order to avoid the extra GET request.
*/
window.fbAsyncInit = function() {
	FB.init({
		appId      : '304040883005114', // App ID
		channelUrl : '//piraadid.ahju.eu/channel.html', // Channel File
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	});
function login (response) {
	if (response.status === "connected") {
		Client.connect({
			id : FB.getUserID(),
			token : FB.getAccessToken()
		});
	}
}
FB.Event.subscribe("auth.statusChange", login);
};

// Load the SDK Asynchronously
(function(d){
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

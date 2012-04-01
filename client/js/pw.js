/*

	pw.js

*/

/*
	PirateWars object could be responsible for application-wide modifications,
	like making AJAX requests and replacing 'content' div.
*/
PirateWars = (function () {

	var gameScriptsLoaded = false;
	var lobbyScriptsLoadded = false;

	var lobbyContent = null;
	var gameContent = null;

	var login = function () {

		if ($("#login-form-username").val().length < 3) {
			console.log("username must be at least 3 characters long");
			return;
		}
		var id = $("#login-form-username").val();
		loadLobbyView();
		Client.setID(id);
		Client.connect();

	};

	// synchronous script loader, jQuery offers $.getScript() function
	// but that is async and since we do not have global variables previously
	// defined, we need to wait until those scripts are executed
	var loadScript = function (file) {

		$.ajax({
			url : file,
			dataType : "script",
			async : false
		});

	};

	var loadLobbyView = function () {

		$("#content").children().hide(0, function() {
			if (lobbyContent === null) {
				$.ajax({
					url : "lobby.html",
					cache : false,
					async : false
				}).done(function (html) {
					$("#content").append(html);
				});
				lobbyContent = $("#lobby");
			} else {
				lobbyContent.show();
			}
		});
		loadLobbyScripts();

	};

	var loadLobbyScripts = function () {

		if (!lobbyScriptsLoadded) {
			loadScript("js/events.js");
			loadScript("js/lobby.js");
			loadScript("js/client.js");
			lobbyScriptsLoadded = true;
		}

	};

	var loadGameView = function () {

		$("#content").children().hide(0, function () {
			if (gameContent === null) {
				$.ajax ({
					url : "game.html",
					cache : false,
					async : false
				}).done(function (html) {
					$("#content").append(html);
				});
				gameContent = $("#game");
			} else {
				gameContent.show();
			}
		});
		loadGameViewScripts();

	};

	var loadGameViewScripts = function () {

		if (!gameScriptsLoaded) {
			loadScript("js/lib/jquery-ui-1.8.18.custom.min.js");
			loadScript("js/game/game.js");
			loadScript("js/game/ship.js");
			loadScript("js/game/player.js");
			gameScriptsLoaded = true;
		}

	}

	return {

		login : login,
		loadLobbyScripts : loadLobbyScripts,
		loadLobbyView : loadLobbyView,
		loadGameView : loadGameView

	};

})();

$(document).ready( function () {

	$("#login-form").submit(function () {
		PirateWars.login();
		return false;
	});

});

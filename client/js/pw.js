/*

	pw.js

*/

/*
	PirateWars object could be responsible for application-wide modifications,
	like making AJAX requests and replacing 'content' div.
*/
PirateWars = (function () {

	var login = function () {

		if ($("#login-form-username").val().length < 3) {
			console.log("username must be at least 3 characters long");
			return false;
		}
		var id = $("#login-form-username").val();
		loadLobby();
		loadScripts();
		Client.setID(id);
		Client.connect();
		return false;

	};

	// this method should load all our scripts once the user
	// has successfully logged in
	var loadScripts = function () {

		loadScript("js/events.js");
		loadScript("js/lobby.js");
		loadScript("js/client.js");

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

	}

	var loadLobby = function () {

		$("#content").children().remove();
		$.ajax({
			url : "lobby.html",
			cache : false,
			async : false
		}).done(function (html) {
			$("#content").append(html);
		});

	};

	return {

		login : login,
		loadScripts : loadScripts,
		loadLobby : loadLobby

	}

})();

$(document).ready( function () {

	$("#login-form").submit(function () {
		PirateWars.login();
		return false;
	})

})

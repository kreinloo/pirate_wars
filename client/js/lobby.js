/*

	lobby.js

*/

/*
	Lobby object handles all the manipulation with DOM objects
	in the lobby view, like adding new messages to the chat log and so on.
*/
var Lobby = (function () {

	/*
		Adds new message to lobby log.
	*/
	var addPublicMessage = function (data) {
		var date = new Date();
		var timestamp = date.getHours() + ":" + date.getMinutes() + ":" +
			date.getSeconds();

		$("#lobby-chat-log").append(
			$("<div >").addClass("chat-message").
				append("<i>" + timestamp + "</i> <b>" +
					data.author + ":</b> " + data.msg)
		);
		$("#lobby-chat-log").scrollTop($("#lobby-chat-log").
			prop("scrollHeight"));
	};

	/*
		Updates user list on connection to server.
	*/
	var updateUserList = function (data) {
		$("#lobby-chat-userlist-table td").remove();
		var user;
		for (var i in data) {
			user = data[i];
			var row = $("<tr>").
				append("<td id='" + user.id + "'>" + user.name + "</td>");
			$("#lobby-chat-userlist-table").append(row);
			if (user.status === GAME.STATUS.WAITING) {
				addNewGame(user);
			}
		}
	};

	/*
		Adds new user to the connected user list.
	*/
	var addConnectedUser = function (data) {
		$("#lobby-chat-userlist-table").
			append( "<tr><td id='" + data.id + "'>" +
				data.name + "</td></tr>" );
	};

	/*
		Removes user from the connected user list.
	*/
	var removeDisconnectedUser = function (data) {
		$("td[id='" + data.id + "']").parent().remove();
	};

	/*
		Adds join button to user who has created new game
		and now waits for opponent.
	*/
	var addNewGame = function (data) {
		var name = data.name;
		var user = $("td[id='" + data.id + "']");
		var button = $("<a href=''>").append("<u>join</u>").click(function () {
			Client.joinGame({ opponentID : data.id, opponentName : data.name });
			return false;
		});
		user.text(name + " | ").append(button);
	};

	/*
		Deletes join button from user who has deleted his/her game.
	*/
	var deleteGame = function (data) {
		var name = data.name;
		var user = $("td[id='" + data.id + "']");
		user.text(name);
	};

	/*
		Button handler for "Create new game" button.
	*/
	var createGameButtonClicked = function () {
		if (Client.createGame()) {
			$("#lobby-game-form-create").remove();
			$("#lobby-game-form").append(
				$("<input>").
					attr("type", "button").
					attr("id", "lobby-game-form-delete").
					attr("value", "Delete game").
					click(function () { deleteGameButtonClicked(); })
			);
		}
	};

	/*
		Button handler for "Delete game" button.
	*/
	var deleteGameButtonClicked = function () {
		if (Client.deleteGame()) {
			$("#lobby-game-form-delete").remove();
			$("#lobby-game-form").append(
				$("<input>").
					attr("type", "button").
					attr("id", "lobby-game-form-create").
					attr("value", "Create new game").
					click(function () { createGameButtonClicked(); })
			);
		}
	};

	var addListenersToButtons = function () {

		$("#lobby-chat-input-form").submit(function () {

			Client.sendPublicMessage( $("#lobby-chat-input-text").val() );
			addPublicMessage({
				author : Client.getName(),
				msg : $("#lobby-chat-input-text").val()
			});
			$("#lobby-chat-input-text").val("");
			return false;

		});

		$("#lobby-game-form-create").click(function () {
			createGameButtonClicked();
			return false;
		});

	}();

	var addStartedGame = function (data) {
		var row = $("<tr>").attr("id", data.gid);
		row.append("<th>" + data.player1 + "</th><th>vs</th><th>" + data.player2 +
			"</th>");
		$("#lobby-games-table").append(row);
	};

	var deleteEndedGame = function (data) {
		$("tr[id=" + data.gid + "]").remove();
	};

	return {

		addPublicMessage : addPublicMessage,
		updateUserList : updateUserList,
		addConnectedUser : addConnectedUser,
		removeDisconnectedUser : removeDisconnectedUser,
		addNewGame : addNewGame,
		deleteGame : deleteGame,

		createGameButtonClicked : createGameButtonClicked,
		deleteGameButtonClicked : deleteGameButtonClicked,
		addListenersToButtons : addListenersToButtons,

		addStartedGame : addStartedGame,
		deleteEndedGame : deleteEndedGame

	};

});

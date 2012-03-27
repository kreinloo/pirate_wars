/*

	lobby.js

*/

/*
	Lobby object handles all the manipulation with DOM objects, like
	adding new messages to the chat log and so on.
*/
Lobby = (function () {

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

	var updateUserList = function (data) {

		$("#lobby-chat-userlist-table td").remove();
		var users = data.users;
		for (i in users) {
			$("#lobby-chat-userlist-table").
				append( "<tr><td userName='" + users[i] + "'>" +
					users[i] + "</td></tr>" );
		}

	};

	var addConnectedUser = function (data) {

		var name = data.name;
		$("#lobby-chat-userlist-table").
			append( "<tr><td userName='" + name + "'>" +
				name + "</td></tr>" );

	};

	var removeDisconnectedUser = function (data) {

		var name = data.name;
		$("td[userName='" + name + "']").remove();

	};

	return {

		addPublicMessage : addPublicMessage,
		updateUserList : updateUserList,
		addConnectedUser : addConnectedUser,
		removeDisconnectedUser : removeDisconnectedUser

	}

})();

$(document).ready(function () {

	$("#lobby-chat-input-form").submit(function () {

		Client.sendPublicMessage( $("#lobby-chat-input-text").val() );
		Lobby.addPublicMessage({
			author : Client.getName(),
			msg : $("#lobby-chat-input-text").val()
		});
		$("#lobby-chat-input-text").val("");
		return false;

	});

});

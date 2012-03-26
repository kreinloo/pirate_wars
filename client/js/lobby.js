/*

	lobby.js

*/

Lobby = {};

$(document).ready(function () {

	$("#lobby-chat-input-form").submit(function () {
		Client.sendPublicMessage( $("#lobby-chat-input-text").val() );
		Lobby.addPublicMessage({
			name: Client.getName(),
			msg: $("#lobby-chat-input-text").val()
		});
		$("#lobby-chat-input-text").val("");
		return false;
	});

	Lobby = (function () {

		var addPublicMessage = function (data) {

			var date = new Date();
			var timestamp = date.getHours() + ":" + date.getMinutes() + ":" +
				date.getSeconds();

			$("#lobby-chat-log").append(
				$("<div>").append("<i>" + timestamp + "</i> <b>" +
					data.name + ":</b> " + data.msg)
			);
			$("#lobby-chat-log").scrollTop($("#lobby-chat-log").
				prop("scrollHeight"));

		};

		var updateUserList = function (data) {

		};

		var addConnectedUser = function (data) {

		};

		var removeDisconnectedUser = function (data) {

		};

		return {
			addPublicMessage : addPublicMessage,
			updateUserList : updateUserList,
			addConnectedUser : addConnectedUser,
			removeDisconnectedUser : removeDisconnectedUser
		}

	})();

});

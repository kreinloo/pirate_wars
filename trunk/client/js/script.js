/*

	

*/
$(document).ready(function () {

	/* sample text */
	$("#game-chat-log").append("<div><b>user1:</b> hello</div>");	
	$("#game-chat-log").append("<div><b>user2:</b> hello</div>");	
	$("#game-chat-log").append("<div><b>user1:</b> let's play</div>");	
	$("#game-chat-log").append("<div><b>user2:</b> ok ...</div>");	
	$("#game-chat-log").scrollTop($(".game-chat-log").prop("scrollHeight"));

	$("#lobby-chat-log").append("<div class='chat-message'>21:01:32 " +
		"<b>John 'Hannibal' Smith:</b> I love it when a plan comes together!</div>");

	$("#lobby-chat-log").append("<div class='chat-message'>21:02:01 " +
		"<b>B.A. Baracus:</b> I ain't flying Hannibal!</div>");

	$("#lobby-chat-log").scrollTop($("#lobby-chat-log").prop("scrollHeight"));

	$("#lobby-chat-userlist-table").append("<tr><td>B.A. Baracus</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>H.M. Murdock</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>John 'Hannibal' Smith</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>Templeton 'Face' Peck</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>Tawnia Baker</td></tr>");
	$("#lobby-chat-userlist-table").append("<tr><td>Amy Amanda Allen</td></tr>");

	$("#lobby-games-running-list-table").append("<tr><td>B.A. Baracus</td><td>vs</td><td>H.M. Murdock</td></tr>");
	$("#lobby-games-running-list-table").append("<tr><td>John 'Hannibal' Smith</td><td>vs</td><td>Templeton 'Face' Peck</td></tr>");
	$("#lobby-games-running-list-table").append("<tr><td>Tawnia Baker</td><td>vs</td><td>Amy Amanda Allen</td></tr>");

	$("#lobby-chat-input-text").keypress(function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			var message = $("#lobby-chat-input-text").val();
			$("#lobby-chat-input-text").val("");
			$("#lobby-chat-log").append("<div class='chat-message'><b>user:</b> " + message + "</div>");
			$("#lobby-chat-log").scrollTop($("#lobby-chat-log").prop("scrollHeight"));
		}; 
	});

	$(".menu-item").hover(
		function () {
			$(this).css("border", "2px solid white");
		},
		function () {
			$(this).css("border", "none");
		}
	);
});

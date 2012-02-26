/*

	

*/
$(document).ready(function () {

	/* sample text */
	$("#game-chat-log").append("<div><b>user1:</b> hello</div>");	
	$("#game-chat-log").append("<div><b>user2:</b> hello</div>");	
	$("#game-chat-log").append("<div><b>user1:</b> let's play</div>");	
	$("#game-chat-log").append("<div><b>user2:</b> ok ...</div>");	
	$("#game-chat-log").append("<div><b>user1:</b> hello</div>");	
	$("#game-chat-log").append("<div><b>user2:</b> hello</div>");	
	$("#game-chat-log").append("<div><b>user2:</b> ok ...</div>");	
	$("#game-chat-log").append("<div><b>user1:</b> move !!!</div>");	
	$("#game-chat-log").append("<div><b>user2:</b> wut !?</div>");
	$("#game-chat-log").append("<div><b>user2:</b> wut !?</div>");
	$("#game-chat-log").append("<div><b>user2:</b> wut !?</div>");
	$("#game-chat-log").scrollTop($(".game-chat-log").prop("scrollHeight"));

	for (var i = 0; i < 40; i++) {
		$("#lobby-chat-log").append("<div><b>user1:</b> hello world!</div>");
	};
	$("#lobby-chat-log").scrollTop($("#lobby-chat-log").prop("scrollHeight"));

	$("#lobby-chat-userlist").append("<div><b>Super Man</b></div>");
	$("#lobby-chat-userlist").append("<div><b>John Smith</b></div>");
	$("#lobby-chat-userlist").append("<div><b>Jane Doe</b></div>");

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

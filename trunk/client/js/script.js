
$(document).ready(function () {

	/* sample text */
	$(".game-chat-log").append("<div><b>user1:</b> hello</div>");	
	$(".game-chat-log").append("<div><b>user2:</b> hello</div>");	
	$(".game-chat-log").append("<div><b>user1:</b> let's play</div>");	
	$(".game-chat-log").append("<div><b>user2:</b> ok ...</div>");	
	$(".game-chat-log").append("<div><b>user1:</b> hello</div>");	
	$(".game-chat-log").append("<div><b>user2:</b> hello</div>");	
	$(".game-chat-log").append("<div><b>user2:</b> ok ...</div>");	
	$(".game-chat-log").append("<div><b>user1:</b> move !!!</div>");	
	$(".game-chat-log").append("<div><b>user2:</b> wut !?</div>");	
	$(".game-chat-log").scrollTop($(".game-chat-log").prop("scrollHeight"));

    for (var i = 0; i < 40; i++) {
        $("#lobby-chat-log").append("<div><b>user1:</b> hello world!</div>");
    };
    $(".lobby-chat-log").scrollTop($(".lobby-chat-log").prop("scrollHeight"));

});

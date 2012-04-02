/*

	events.js

	This file contains definitions of different events.
	Both client and server will read this file.

*/

SERVER = {
	STATUS : "SERVER_STATUS",
	USER_CONNECTED : "SERVER_USER_CONNECTED",
	USER_DISCONNECTED : "SERVER_USER_DISCONNECTED"
};

CHAT = {
	PUBLIC_MESSAGE : "CHAT_PUBLIC_MESSAGE",
	USER_LIST : "CHAT_USER_LIST"
};

GAME = {
	CREATE : "GAME_CREATE",
	DELETE : "GAME_DELETE",
	JOIN_REQUEST : "GAME_JOIN_REQUEST",
	START : "GAME_START",
	INFO : "GAME_INFO",
	STATUS : {
		PLAYING : "GAME_STATUS_PLAYING",
		// waiting for opponent
		WAITING : "GAME_STATUS_WAITING",
		IDLE : "GAME_STATUS_IDLE"
	}
};

CLIENT = {
	AUTH : "CLIENT_AUTH"
};

// for the server
if (typeof module != "undefined") {
	module.exports.SERVER = SERVER;
	module.exports.CHAT = CHAT;
	module.exports.GAME = GAME;
	module.exports.CLIENT = CLIENT;
}

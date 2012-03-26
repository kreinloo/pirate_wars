/*

	events.js

	This file contains definitions of different events.
	Both client and server will read this file.

*/

SERVER = {
	STATUS : "SERVER_STATUS"
};

CHAT = {
	USER_CONNECTED : "CHAT_USER_CONNECTED",
	USER_DISCONNECTED : "CHAT_USER_DISCONNECTED",
	PUBLIC_MESSAGE : "CHAT_PUBLIC_MESSAGE",
	USER_LIST : "CHAT_USER_LIST"
};

GAME = {

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

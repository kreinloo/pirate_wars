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
	STARTED_GAME : "GAME_STARTED_GAME",
	ENDED_GAME : "GAME_ENDED_GAME",
	ACTIVE_GAMES : "GAME_ACTIVE_GAMES",
	STATUS : {
		PLAYING : "GAME_STATUS_PLAYING",
		// waiting for opponent
		WAITING : "GAME_STATUS_WAITING",
		IDLE : "GAME_STATUS_IDLE"
	},
	ACTION : {
		FIREAT : "GAME_ACTION_FIREAT",
		FIREAT_RESPONSE : "GAME_ACTION_FIREAT_RESPONSE",
		ADD_VERTICAL_SHIP : "GAME_ACTION_ADD_VERTICAL_SHIP",
		ADD_HORIZONTAL_SHIP : "GAME_ACTION_ADD_HORIZONTAL_SHIP",
		DELETE_SHIP : "GAME_ACTION_DELETE_SHIP",
		RESET_FIELD : "GAME_ACTION_RESET_FIELD",
		CONFIRM_ALIGNMENT : "GAME_ACTION_CONFIRM_ALIGNMENT",
		PRIVATE_CHAT : "GAME_ACTION_PRIVATE_CHAT",
		LOAD_BATTLE_PHASE : "GAME_ACTION_LOAD_BATTLE_PHASE",
		GAME_OVER : "GAME_ACTION_GAME_OVER"
	},
	PHASE : {
		ALIGNMENT : "GAME_PHASE_ALIGNMENT",
		BATTLE : "GAME_PHASE_BATTLE",
		GAME_OVER : "GAME_PHASE_GAME_OVER"
	}
};

CLIENT = {
	AUTH : "CLIENT_AUTH"
};

SCOREBOARD = {
	REQUEST : "SCOREBOARD_REQUEST",
	DATA : "SCOREBOARD_DATA"
};

TILE = {
	SHIP_NOSE: "gfx/ShipNose.png",
	SHIP_BASE1: "gfx/ShipBase1.png",
	SHIP_BASE2: "gfx/ShipBase2.png",
	SHIP_BASE3: "gfx/ShipBase3.png",
	SHIP_TAIL: "gfx/ShipTail.png",
	SHIP_SINGLE1: "gfx/SingleShip1.png",
	SHIP_SINGLE2: "gfx/SingleShip2.png",
	FOG: "gfx/FogTexture3.png",
	FOG_UP: "gfx/FogUp.png",
	FOG_BOTTOM: "gfx/FogBottom.png",
	FOG_LEFT: "gfx/FogLeft.png",
	FOG_RIGHT: "gfx/FogRight.png",
	FIRE: "gfx/Fire3.gif",
	SPLASH: "gfx/WaterSplash.png"
};

SHIPS = {
	SHIP_1_horizontal : "gfx/SHIP_1_horizontal.png",
	SHIP_1_vertical : "gfx/SHIP_1_vertical.png",
	SHIP_2_horizontal : "gfx/SHIP_2_horizontal.png",
	SHIP_2_vertical : "gfx/SHIP_2_vertical.png",
	SHIP_3_horizontal : "gfx/SHIP_3_horizontal.png",
	SHIP_3_vertical : "gfx/SHIP_3_vertical.png",
	SHIP_4_horizontal : "gfx/SHIP_4_horizontal.png",
	SHIP_4_vertical : "gfx/SHIP_4_vertical.png"
};

// for the server
if (typeof module != "undefined") {
	module.exports.SERVER = SERVER;
	module.exports.CHAT = CHAT;
	module.exports.GAME = GAME;
	module.exports.CLIENT = CLIENT;
	module.exports.SCOREBOARD = SCOREBOARD;
}

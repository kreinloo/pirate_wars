/*

	sound.js

*/

var Sound = (function () {

	"use strict";
	
	// You may call me constructor as I'm the one initiating variables.
	
	var muteEffects = false;
	var muteMusic	= false;
	var effectsVolume = 0.9;
	var musicVolume = 0.5;
	var currentSong = null;
	var currentEffect = null;
	
	var music = {
		LOBBY : new Audio("sfx/LOBBY.ogg"),
		ALIGNMENT : new Audio("sfx/ALIGNMENT.ogg"),
		BATTLE : new Audio("sfx/BATTLE.ogg")
	};
	
	var effects =  {
		PLACE_SHIP : [
			new Audio("sfx/PLACE_SHIP.ogg")
		],
		ROTATE_SHIP : [
			new Audio("sfx/ROTATE_SHIP.ogg")
		],
		START_BATTLE : [
			new Audio("sfx/START_BATTLE.ogg")
		],
		HIT_WATER	: [
			new Audio("sfx/HIT_WATER.ogg"),
			new Audio("sfx/HIT_WATER2.ogg")
		],
		HIT_SHIP	: [
			new Audio("sfx/HIT_SHIP.ogg")
		],
		SHIP_SINK	: [
			new Audio("sfx/SHIP_SINK.ogg"),
			new Audio("sfx/SHIP_SINK2.ogg")
		],
		VICTORY : [
			new Audio("sfx/VICTORY.ogg")
		],
		DEFEAT : [
			new Audio("sfx/DEFEAT.ogg")
		]
	};
	
	/*
		By default audio should be preloaded, but according to some sources
		there are retarded browsers that refuse to do that! (haven't confirmed it myself)
		So to be on the safe side let's force it down their throats!
	*/
	for (var effects_cat in effects) {
		for (var i = 0; i < effects[effects_cat].length; i++) {
			console.log("Preloading " + effects[effects_cat][i].src + ".");
			effects[effects_cat][i].load();
		}
	}
	for (var song in music) {
		if (music[song] == null) continue;
		console.log("Preloading " + music[song].src + ".");
		music[song].load();
	}
		
	// Methods be down there, yes.
		
	/* 
		Getters, setters to satisfy outsiders (UI?): maybe some heretics would dare to want
		to mute our waves of glory. Burn them all!
	*/
		
	this.getMusicVolume = function () {
		return musicVolume;
	};
	
	this.getEffectsVolume = function () {
		return effectsVolume;
	};
	
	this.setMusicVolume = function (volume) {
		if ((volume >= 0.0) && (volume <= 1.0)) {
			console.log("Adjusting music volume to " + volume + " (0.0 - 1.0).");
			musicVolume = volume;
			currentSong.volume = volume;
		}
	};
	
	this.setEffectsVolume = function (volume) {
		if ((volume >= 0.0) && (volume <= 1.0)) {
			console.log("Adjusting effects volume to " + volume + " (0.0 - 1.0).");
			effectsVolume = volume;
		}
	}
	
	this.getMusicMute = function () {
		return muteMusic;
	};
	
	this.getMuteEffects = function () {
		return muteEffects;
	};
	
	
	this.setMuteMusic = function (mute) {
			if (mute) console.log("Muting music.");
			else console.log("Unmuting music.");
			
			muteMusic = mute;
			if (currentSong != null) {
				if (mute) currentSong.pause();
				else currentSong.play();
			}
	};
	
	this.setMuteEffects = function (mute) {
			if (mute) console.log("Muting effects.");
			else console.log("Unmuting effects.");
			
			muteEffects = mute;
	};
	
	/*
		Actual magic to initiate the true pleasure for yar' ears!
	*/
	
	this.playMusic = function (song) {
		if (typeof music[song] === undefined) return;
		if ((!muteMusic) && (currentSong != null) && (currentSong.currentTime != currentSong.duration))
			this.stopMusic();
		
		currentSong = music[song];
		currentSong.volume = musicVolume;
		currentSong.loop = true;
		/*
			Oh gods.. loop not implemented in most browsers, of course!
			Why do we always have to do it the hard way -.-
		*/
		currentSong.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
		}, false);
		
		if (muteMusic) return;
		console.log("Playing music: " + song + ".");
		currentSong.play();
	};
	
	this.stopMusic = function () {
		if (currentSong == null) return;
		console.log("Music stopped: " + currentSong.src + ".");
		currentSong.pause();
		currentSong = null;
	};

	this.playEffect = function (effect) {
		if (muteEffects) return;
		effect = effect.toUpperCase();
		if (typeof effects[effect] === undefined) return;
		console.log("Playing sound effect: " + effect + ".");
		
		var index = 0;
		switch (effects[effect].length) {
		case 0:
			return;
		case 1:
			break;
		default:
			index = Math.floor(Math.random() * effects[effect].length);
			break;
		}
		
		/*
			If the same audio track is requested again before it ends,
			the old one is just interrupted. It won't get too noisy this way.
		*/
		
		currentEffect = effects[effect][index];
		currentEffect.currentTime = 0.0;
		currentEffect.volume = effectsVolume;
		currentEffect.play();
	};
	
});

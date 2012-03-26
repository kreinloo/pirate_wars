/*

	login.js

*/

$(document).ready(function() {

	$("#login-form").submit(function () {
		login();
		return false;
	})

});

// event listener for the login button in the login view
function login () {
	if ($("#login-form-username").val().length < 3) {
		console.log("username must be at least 3 characters long");
		return;
	}
	Client.setID($("#login-form-username").val());
	Client.connect();
	loadLobby();
}

// removes login view content and loads lobby view
function loadLobby () {
	$("#content").children().remove();
	$.ajax({
		url: "lobby.html",
		cache: false
	}).done(function (html) {
		$("#content").append(html);
	});
	$.getScript("js/lobby.js");

}

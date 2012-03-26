/*

	serverclient.js

*/

ServerClient = function (ID) {

	// ID should be facbook's user ID
	var id = ID;

	// right now name is equal to ID
	// but in the future it should be
	// user's full name taken from facebook
	var name = ID;

	var getID = function () { return id; };
	var getName = function () { return name; };

	return {
		getID : getID,
		getName : getName
	}

}

module.exports.ServerClient = ServerClient;

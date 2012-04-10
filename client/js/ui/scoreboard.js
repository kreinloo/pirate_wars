var Scoreboard = (function () {

	"use strict";

	var refreshData = function (data) {
		// Remove all rows except first.
		$("#scoreboard-table").find("tr:gt(0)").remove();
		// Populate table with new data.
		for (var i = 0; i < data.length; i++) {
			var row = data[i];
			$("#scoreboard-table").
				append(
					"<tr>" +
					"<th>" + (i + 1) + "</th>" +
					"<th>" + row.username + "</th>" +
					"<th>" + row.wins  + "</th>" +
					"<th>" + row.losses  + "</th>" +
					"<th>" + row.ratio  + "</th>" +
					"</tr>"
				);
		}
	};

	return {
		refreshData : refreshData
	};

});

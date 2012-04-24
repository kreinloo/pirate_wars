var Replay = (function () {

	this.populateTable = function (data) {
		this.clearTable();
		var row, btn;
		for (var i in data) {
			row = $("<tr>").addClass("gameEntry");
			row.append($("<td>").append(data[i].gid));
			row.append($("<td>").append(data[i].opponent));
			row.append($("<td>").append(data[i].date));
			if (data[i].winner)
				row.append($("<td>").append("WIN"));
			else
				row.append($("<td>").append("LOSS"));
			btn = $("<button>")
				.attr("gid", data[i].gid)
				.append("Replay");
			btn.click(function () {
				Client.getReplayManager().playGame($(this).attr("gid"));
			});
			row.append(btn);
			$("#replay-table").append(row);
		}
	};

	this.clearTable = function () {
		$(".gameEntry").remove();
	};

});

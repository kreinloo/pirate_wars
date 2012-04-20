var Replay = (function () {

	this.populateTable = function (data) {
		this.clearTable();
		var row, btn;
		for (var i in data) {
			row = $("<tr>").addClass("gameEntry");
			row.append($("<td>").append(data[i].gid));
			row.append($("<td>").append(data[i].opponent));
			row.append($("<td>").append(data[i].date));
			row.append($("<td>").append(data[i].result));
			btn = $("<button>").append("Replay");
			btn.click(function () {
				// play selected game
			});
			row.append(btn);
			$("#replay-table").append(row);
		}
	};

	this.clearTable = function () {
		$(".gameEntry").remove();
	};

});

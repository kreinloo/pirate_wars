--
-- SQLite3 database dump
--

PRAGMA foreign_keys = ON;

CREATE TABLE pw_player (
	id INTEGER PRIMARY KEY, 
	username CHARACTER VARYING(255) UNIQUE NOT NULL
);

CREATE TABLE pw_game (
	id INTEGER PRIMARY KEY,
	"time" DATETIME,
	winner INTEGER NOT NULL,
	loser INTEGER NOT NULL,
	FOREIGN KEY(winner) REFERENCES pw_player(id),
	FOREIGN KEY(loser) REFERENCES pw_player(id)
);

CREATE VIEW pw_scoreboard AS
    SELECT player.id, player.username, COALESCE(wins.count, 0) AS wins, COALESCE(losses.count, 0) AS losses, COALESCE((COALESCE(CAST(wins.count AS FLOAT), 0.0) / NULLIF((COALESCE(wins.count, 0.0) + COALESCE(losses.count, 0.0)), 0.0)), 0.0) AS ratio FROM ((pw_player player LEFT JOIN (SELECT pw_game.winner, count(*) AS count FROM pw_game GROUP BY pw_game.winner) wins ON ((wins.winner = player.id))) LEFT JOIN (SELECT pw_game.loser, count(*) AS count FROM pw_game GROUP BY pw_game.loser) losses ON ((losses.loser = player.id))) ORDER BY COALESCE((COALESCE(CAST(wins.count AS FLOAT), 0.0) / NULLIF((COALESCE(wins.count, 0.0) + COALESCE(losses.count, 0.0)), 0.0)), 0.0) DESC;

--
-- PostgreSQL database dump
--

CREATE TABLE pw_game (
    id integer NOT NULL,
    "time" timestamp without time zone,
    winner integer NOT NULL,
    loser integer NOT NULL
);

CREATE SEQUENCE pw_game_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE pw_player (
    id integer NOT NULL,
    username character varying(32) NOT NULL
);

CREATE VIEW pw_scoreboard AS
    SELECT player.id, player.username, COALESCE(wins.count, (0)::bigint) AS wins, COALESCE(losses.count, (0)::bigint) AS losses, COALESCE((COALESCE((wins.count)::numeric, 0.0) / NULLIF((COALESCE((wins.count)::numeric, 0.0) + COALESCE((losses.count)::numeric, 0.0)), 0.0)), 0.0) AS ratio FROM ((pw_player player LEFT JOIN (SELECT pw_game.winner, count(*) AS count FROM pw_game GROUP BY pw_game.winner) wins ON ((wins.winner = player.id))) LEFT JOIN (SELECT pw_game.loser, count(*) AS count FROM pw_game GROUP BY pw_game.loser) losses ON ((losses.loser = player.id))) ORDER BY COALESCE((COALESCE((wins.count)::numeric, 0.0) / NULLIF((COALESCE((wins.count)::numeric, 0.0) + COALESCE((losses.count)::numeric, 0.0)), 0.0)), 0.0) DESC;

CREATE SEQUENCE pw_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY pw_game ALTER COLUMN id SET DEFAULT nextval('pw_game_id_seq'::regclass);

ALTER TABLE ONLY pw_player ALTER COLUMN id SET DEFAULT nextval('pw_user_id_seq'::regclass);

ALTER TABLE ONLY pw_game
    ADD CONSTRAINT pw_game_pkey PRIMARY KEY (id);

ALTER TABLE ONLY pw_player
    ADD CONSTRAINT pw_user_pkey PRIMARY KEY (id);

ALTER TABLE ONLY pw_player
    ADD CONSTRAINT pw_user_username_key UNIQUE (username);

ALTER TABLE ONLY pw_game
    ADD CONSTRAINT "pw_game.loser_2_pw_player.id" FOREIGN KEY (loser) REFERENCES pw_player(id);

ALTER TABLE ONLY pw_game
    ADD CONSTRAINT "pw_game.winner_2_pw_player.id" FOREIGN KEY (winner) REFERENCES pw_player(id);

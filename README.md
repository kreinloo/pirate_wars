Pirate Wars
===========

Current architecture
--------------------
<pre>
Server ----------------------- Client ---------------------- UI
   |                              |                           |
   |                              |               ------------------------
   |                              |               |         |            |
GameServer                  ServerInterface      Game     Lobby     Scoreboard
   |                              |
   |                              |
   |                              |
 Game                           Player
</pre>

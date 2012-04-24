Pirate Wars
===========

Current architecture
--------------------
<pre>

                        +-----------------------------+
                        |                             |
                        |                             |
                        +                             +
  +------------------+Server+---------+             Client+-------------------------+
  |                   +   +           |              +  +                           |
  |                   |   |           |              |  |                           |
  |         +---------+   |           |              |  +-------------+             |
  |         |             |           |              |                |             |
  |         |             |           |              |                |             |
  +         +             +           +              +                +             +
Client   GameServer   Scoreboard   Database    ServerInterface   ReplayManager      UI
            +                                        +                              +
            |                                        |                              |
            |                                        |                              |
            +                                        +        +-------+--------+----------+---------+
           Game                                   Player      |       |        |          |         |
                                                              +       +        +          +         +
                                                            Lobby   Game   Scoreboard   Sound    Replay
 </pre>

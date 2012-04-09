Pirate Wars
===========

Current architecture
--------------------
<pre>
                   +-----------------------------+
                   |                             |
                   |                             |
                   +                             +
    +----------+ Server +------+               Client +---------------+ UI
    |              +           |                 +                      +
    |              |           |                 |                      |
    |              |           |                 |              +-------+--------+
    +              |           +                 +              |       |        |
 GameServer        |        Database       ServerInterface      +       +        +
    +              +                             +            Lobby   Game   Scoreboard
    |          Scoreboard                        |
    |                                            |
    +                                            +
   Game                                       Player
 </pre>

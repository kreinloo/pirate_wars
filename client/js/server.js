/*
  server.js
  
  Server interface (and dummy implementation) and all helper classes for it.
  From UI/API it should be necessary to call only methods of the Server()
    class.
  Those methods have also been documented (unlike most of the others).
*/

// Represents different erroneous situations (used for throwing)
ERROR = {
  // Dummy (probably not used)
  NONE: 0,
  // The move isn't legal (invalid coordinates for example)
  INVALID_MOVE: 1,
  // Player has already fired on that cell
  REPEATED_MOVE: 2,
  // It's not player's turn to fire
  WRONG_TURN: 3,
  // It's not possible to do that in current game phase
  INVALID_PHASE: 4
}

// Represents result of firing
HIT = {
  // Hit the water
  WATER: 10,
  // Hit tile of enemy ship
  SHIP: 11,
  // Hit tile of enemy ship that was also last part of it
  WHOLE_SHIP: 12,
  // Hit last tile of last ship - won
  GAME_OVER: 13
}

// Represents different phases of game
PHASE = {
  // First phase: placing ships on the field
  ALIGNMENT: 20,
  // Main/battle phase: firing at enemy squares
  BATTLE: 21,
  // Game over
  GAME_OVER: 22
}

/*
  Class: Server()
  Interface for communicating with server.
  The only class that should be necessary to call from outside.
*/
function Server() {
  var currentGame;
  var localPlayerId;
  var brains;
  
  localPlayerId = 0;
  currentGame = new Game();
  brains = new AI(currentGame.getPlayerById(1));
  
  return {
    /* 
      FireAt(row, col)
      Fires at enemy field.
      Returns result of the action (look HIT table)
        or an exception (look ERROR table).
    */
    fireAt : function(row, col) {
      if (currentGame.getGamePhase() != PHASE.BATTLE)
        throw ERROR.INVALID_PHASE +" " + currentGame.getGamePhase();
      if ((typeof row != 'number') || (typeof col != 'number'))
        throw ERROR.INVALID_MOVE;
      if ((row < 0) || (col < 0))
        throw ERROR.INVALID_MOVE;
      if ((row >= 10) || (row >= 10))
        throw ERROR.INVALID_MOVE;
      if (localPlayerId != currentGame.getActivePlayerId())
        throw ERROR.WRONG_TURN;
        
      var activePlayer = currentGame.getActivePlayer();
      var opponentPlayer = currentGame.getOpponentPlayer();
      if (!activePlayer.isMoveUnique(row, col))
        throw ERROR.REPEATED_MOVE;
        
      var opponentsField = opponentPlayer.getGameField();
      var result = opponentsField.fireAt(row, col);
      if (result == HIT.GAME_OVER)
        currentGame.incGamePhase();
      activePlayer.pushMove(row, col);
      currentGame.rotatePlayer();
      return result;
    },
    
    /*
      waitForOpponent()
      In fake-server implementation should be called after
        your own turn. In real solution I suppose the call should
        be timed (returns undefined or something if enemy hasn't made
        her move yet).
      Returns array of result (
        0 - row where enemy fired.
        1 - column where enemy fired.
        2 - the result of act (look HIT table).
    */
    waitForOpponent : function() {
      if (currentGame.getGamePhase() != PHASE.BATTLE)
        throw ERROR.INVALID_PHASE;
      if (localPlayerId == currentGame.getActivePlayerId())
        throw ERROR.WRONG_TURN;
      var activePlayer = currentGame.getActivePlayer();
      var opponentPlayer = currentGame.getOpponentPlayer();
      var opponentsField = opponentPlayer.getGameField();
      
      var target = brains.popNextMove();
      var result = opponentsField.fireAt(target[0], target[1]);
      if (result == HIT.GAME_OVER)
        currentGame.incGamePhase();
      activePlayer.pushMove(target[0], target[1]);
      currentGame.rotatePlayer();
      target.push(result);
      return target;
    },
    
    /*
      addVerticalShip(row, col, length)
      Adds ship with vertical alignment on your field.
        The (row, col) specifies the uppermost tile of the ship.
      Currently does NOT validate the placement (whether it's colliding
        with other ships etc.), because it's already done in the UI and both
        are client-side anyway. Of course in the real server implementation it
        should be also verified on server-side for security reasons.
    */
    addVerticalShip : function(row, col, length) {
      if (currentGame.getGamePhase() != PHASE.ALIGNMENT)
        throw ERROR.INVALID_PHASE;
      
      var gameField = currentGame.getPlayerById(localPlayerId).getGameField();
      gameField.addVerticalShip(row, col, length);
	  //gameField.printMatrix();
	  //console.log("###############################");
    },
    
    /*
      addHorizontalShip(row, col, length)
      Adds ship with horizontal alignment on your field.
        The (row, col) specifies the leftmost tile of the ship.
      Currently does NOT validate the placement (whether it's colliding
        with other ships etc.), because it's already done in the UI and both
        are client-side anyway. Of course in the real server implementation it
        should be also verified on server-side for security reasons.
    */
    addHorizontalShip : function(row, col, length) {
      if (currentGame.getGamePhase() != PHASE.ALIGNMENT)
        throw ERROR.INVALID_PHASE;
        
      var gameField = currentGame.getPlayerById(localPlayerId).getGameField();
      gameField.addHorizontalShip(row, col, length);
	  gameField.printMatrix();
	  console.log("###############################");
    },
    
    /*
      deleteShip(row, col)
      Removes the ship from specified location. It's not important which
        tile you give as parameter as the whole boat is deleted anyway.
    */
    deleteShip : function (row, col) {
      if (currentGame.getGamePhase() != PHASE.ALIGNMENT)
        throw ERROR.INVALID_PHASE;
      
      var gameField = currentGame.getPlayerById(localPlayerId).getGameField();
      gameField.deleteShip(row, col);
	  gameField.printMatrix();
	  console.log("###############################");
    },
	/*resetField()
		function that resets the player's matrix once reset button is pushed.
	*/
	resetField : function () {
      if (currentGame.getGamePhase() != PHASE.ALIGNMENT)
        throw ERROR.INVALID_PHASE;
      
      var gameField = currentGame.getPlayerById(localPlayerId).getGameField();
	  gameField.resetField();
	  gameField.printMatrix();
	  console.log("###############################");
	},
    
    /*
      confirmAlignment()
      Confirms that you're satisfied with the alignment of ships you have done
        and "locks" it.
      Currenly does not verify that all ships have added - if it's done in UI
        then it should be not necessary as both are client-side anyway.
    */
    confirmAlignment : function() {
      if (currentGame.getGamePhase() != PHASE.ALIGNMENT)
        throw ERROR.INVALID_PHASE;
      var localPlayer = currentGame.getPlayerById(localPlayerId);
      
      localPlayer.setReady(true);
      if (currentGame.areBothPlayersReady())
		console.log ("server phase: " + currentGame.getGamePhase );
        currentGame.incGamePhase();
		console.log ("server phase: " + currentGame.getGamePhase() );
		
    },
    
    /*
      opponentsAlignment()
      Checks whether enemy has made her choice of ships placement. 
        Returns true if choice has been made.
      In this dummy-server solution it always does hardcoded placement when
        the method is called.
      In real solution I suppose it should timed called.
    */
    opponentsAlignment : function() {
      if (currentGame.getGamePhase() != PHASE.ALIGNMENT)
        throw ERROR.INVALID_PHASE;
        
      var aiPlayer = brains.getPlayer();
      var aiField = aiPlayer.getGameField();
      
      // Hardcoded alignment
      aiField.addHorizontalShip(0,0,4);
      
      aiField.addHorizontalShip(2,0,3);
      aiField.addHorizontalShip(4,0,3);
      
      aiField.addHorizontalShip(6,0,2);
      aiField.addHorizontalShip(8,0,2);
      aiField.addHorizontalShip(7,5,3);
      
      aiField.addHorizontalShip(1,5,1);
      aiField.addHorizontalShip(3,5,1);
      aiField.addHorizontalShip(5,5,1);
      aiField.addHorizontalShip(9,5,1);
      
      aiPlayer.setReady(true);
      if (currentGame.areBothPlayersReady())
        currentGame.incGamePhase();
      return true;
    },
    
    /*
      getCurrentGame()
      Returns the object of current game.
      For debugging purposes!
    */
    getCurrentGame : function() {
      return currentGame;
    },
	isGameOver : function(){
		return currentGame.getGamePhase()==22 ? true :false;
	},
    getActivePlayerId : function() {
		return currentGame.getActivePlayerId();
	},
    /*
      printPlayerFieldById(playerId)
      Prints the matrix of gamefield of player with id 'playerId'.
        In dummy-server: 
          0 - human player
          1 - AI player
      For debugging purposes!
    */
    printPlayerFieldById : function(playerId) {
      return currentGame.getPlayerById(playerId).getGameField().printMatrix();
    }
  }
}

/*
  Class: AI(playerObj) 
  Creates artificial intelligence (more like artificial idiot)
    and ties it with player object 'playerObj'.
  The AI pre-generates the list of moves so it's not necessary to
    check if they're unique. Moves are pseudo-random.
*/
function AI(playerObj) {
  var movesToDo;
  var playerObj;
  
  this.playerObj = playerObj;
  
  function arrayShuffle(arrayToShuffle) {
    var arrayLen = arrayToShuffle.length;
    for (var i = arrayLen-1; i >= 0; i--) {
      var j = parseInt(Math.random() * arrayLen);
      var temp = arrayToShuffle[i];
      arrayToShuffle[i] = arrayToShuffle[j];
      arrayToShuffle[j] = temp;
    }
  }
  
  movesToDo = new Array();
  for (var col = 0; col < 10; col++) {
    for (var row = 0; row < 10; row++)
      movesToDo.push(new Array(row, col));
  }
  arrayShuffle(movesToDo);
  
  return {
    popNextMove : function() {
      return movesToDo.pop();
    },
    
    getPlayer : function() {
      return playerObj;
    }
  }
}

/*
  Class: Game()
  Represents instance of game and manipulates with it. 
  Holds information about active phase,
    active player (whose turn it is),
    references to player-objects,
*/
function Game() {
  var players;
  var activePlayer;
  var gamePhase;
  
  players = new Array(2);

  players[0] = new Player();

  players[1] = new Player();
  activePlayer = 0;
  gamePhase = PHASE.ALIGNMENT;
  
  return {
    getActivePlayerId : function () {
      return activePlayer;
    },
    
    getActivePlayer : function() {
      return players[activePlayer];
    },
    
    getOpponentPlayer : function() {
      return players[activePlayer == 1 ? 0 : 1];
    },
    
    rotatePlayer : function() {
      activePlayer = activePlayer == 1 ? 0 : 1;
    },
    
    getGamePhase : function() {
      return gamePhase;
    },
    
    incGamePhase : function() {
      gamePhase++;
    },
    
    getPlayerById : function(playerId) {
      return players[playerId];
    },
    
    areBothPlayersReady : function() {
      return (players[0].getReady() && players[1].getReady());
    }
  }
}

/*
  Class: Player()
  Represents player, holds necessary information and references
    about her: like history of moves, reference to field object,
    whether player is ready for battle (in alignment phase).
*/
function Player() {
  var gameField;
  var movesHistory;
  var ready;

  gameField = new Field();
  movesHistory = [];
  ready = false;
  return {
    getMovesHistory : function() {
      return movesHistory;
    },
    
    isMoveUnique : function(row, col) {
      var index = $.inArray(row + 'x' + col, movesHistory);
      return (index == -1 ? true : false);
    },
    
    pushMove : function(row, col) {
      movesHistory.push(row + 'x' + col);
    },
    
    getGameField : function() {
      return gameField;
    },
    
    setReady : function (isReady) {
      ready = isReady;
    },
    
    getReady : function() {
      return ready;
    }
  }
}

/*
  Class: Field()
  Represents the field of game and provides manipulation with it.
  Basically has 10x10 matrix that holds information about each cell.
  Also knows how many ships are left in the field (getShipsLeft() method).
*/
function Field() {
  /*
  0 - water (not shot)
  1 - water (shot)
  2 - ship  (not shot)
  3 - ship (shot)
  */

  var matrix;
  var shipsLeft;
  
  function initializeMatrix() {
    matrix = new Array(10);
    for (var i = 0; i < 10; i++) {
      matrix[i] = new Array(10);
      for (var j = 0; j < 10; j++)
        matrix[i][j] = 0;
    }
  }
  
  

  
  function addShip(row, col, row_len, col_len) {
    if ((row < 0) || (col < 0))
      return;
    if ((row >= 10) || (col >= 10))
      return;
      
    if ((row_len == 0) && (col_len == 0))
      return;
    
    matrix[row][col] = 2;
    addShip(
      row_len != 0 ? row + 1 : row,
      col_len != 0 ? col + 1 : col,
      row_len != 0 ? row_len - 1 : 0, 
      col_len != 0 ? col_len - 1 : 0);
  }
  
  initializeMatrix();
  shipsLeft = 0;
  
  return {
  
    resetField : function() {
		  for (var i = 0; i < 10; i++) {
			for (var j = 0; j < 10; j++)
				matrix[i][j] = 0;
		}
		shipsLeft = 0;
	},
    getMatrix : function() {
      return matrix;
    },
    
    printMatrix : function () {
      for (var i = 0; i < 10; i++)
        console.log (matrix[i]);
    },
    
    getShipsLeft : function() {
      return shipsLeft;
    },
    
    fireAt : function(row, col) {
      function countWholeParts(row, col, move_row, move_col) {
        if ((typeof move_row == 'undefined') && (typeof move_col == 'undefined')) {
          var count;
          count = countWholeParts(row + 1, col, 1, 0);
          count += countWholeParts(row - 1, col, -1, 0);
          count += countWholeParts(row, col + 1, 0, 1);
          count += countWholeParts(row, col - 1, 0, -1);
          return count;
        }
      
        if ((row < 0) || (col < 0))
          return 0;
        if ((row >= 10) || (col >= 10))
          return 0;
        if (matrix[row][col] < 2)
          return 0;
                 
        return (matrix[row][col] == 2 ? 1 : 0)
          + countWholeParts(row + move_row, col + move_col, move_row, move_col);
      }
      
      if (shipsLeft <= 0) return HIT.GAME_OVER;

      switch (matrix[row][col]) {
        case 0:
          matrix[row][col] = 1;
          return HIT.WATER;
        case 1:
          throw ERROR.ILLEGAL_MOVE;
        case 2:
          matrix[row][col] = 3;
          if (countWholeParts(row, col) == 0) {
            shipsLeft--;
            if (shipsLeft <= 0)
              return HIT.GAME_OVER;
            return HIT.WHOLE_SHIP;
          }
          return HIT.SHIP;
        case 3:
          throw ERROR.ILLEGAL_MOVE;
      }
    
    },
    
    addVerticalShip : function(row, col, length) {
	  console.log("Server: Added ship vertically : row: "+ row + " col: "+col + " Length: "+ length);
      addShip(row, col, length, 0);
      shipsLeft++;
    },
    
    addHorizontalShip : function(row, col, length) {
	  console.log("Server: Added ship horizontally : row: "+ row + " col: "+col + " Length: " +length);
      addShip(row, col, 0, length);
      shipsLeft++;
    },
    
    deleteShip : function (row, col) {
	console.log("deleted ship : "+ row +" "  +col );
      function recursiveDelete(row, col, move_row, move_col) {
        if ((row < 0) || (col < 0))
          return;
        if ((row >= 10) || (col >= 10))
          return;
        if (matrix[row][col] < 2)
          return;

        matrix[row][col] = 0;
        recursiveDelete(row + move_row, col + move_col, move_row, move_col);
      }
      
      if (matrix[row][col] < 2) return;
      
      matrix[row][col] = 0;
      recursiveDelete(row + 1, col, 1, 0);
      recursiveDelete(row - 1, col, -1, 0);
      recursiveDelete(row, col + 1, 0, 1);
      recursiveDelete(row, col - 1, 0, -1);
      shipsLeft--;
    }
  }
}

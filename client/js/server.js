ERROR = {
  NONE: 0,
  INVALID_MOVE: 1,
  REPEATED_MOVE: 2,
  WRONG_TURN: 3,
  INVALID_PHASE: 4
}

HIT = {
  WATER: 10,
  SHIP: 11,
  WHOLE_SHIP: 12,
  GAME_OVER: 13
}

PHASE = {
  ALIGNMENT: 20,
  BATTLE: 21,
  GAME_OVER: 22
}

function Server() {
  var currentGame;
  var localPlayerId;
  var brains;
  
  localPlayerId = 0;
  currentGame = new Game();
  brains = new AI(currentGame.getPlayerById(1));
  
  return {
    fireAt : function(row, col) {
      if (currentGame.getGamePhase() != PHASE.BATTLE)
        throw ERROR.INVALID_PHASE;
      if ((typeof row != "number") || (typeof col != "number"))
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
    
    addVerticalShip : function(row, col, length) {
      if (currentGame.getGamePhase() != PHASE.ALIGNMENT)
        throw ERROR.INVALID_PHASE;
      
      var gameField = currentGame.getPlayerById(localPlayerId).getGameField();
      gameField.addVerticalShip(row, col, length);
    },
    
    addHorizontalShip : function(row, col, length) {
      if (currentGame.getGamePhase() != PHASE.ALIGNMENT)
        throw ERROR.INVALID_PHASE;
        
      var gameField = currentGame.getPlayerById(localPlayerId).getGameField();
      gameField.addHorizontalShip(row, col, length);
    },
    
    deleteShip : function (row, col) {
      if (currentGame.getGamePhase() != PHASE.ALIGNMENT)
        throw ERROR.INVALID_PHASE;
      
      var gameField = currentGame.getPlayerById(localPlayerId).getGameField();
      gameField.deleteShip(row, col);
    },
    
    confirmAlignment : function() {
      // TODO: Validation for ship alignment?
      if (currentGame.getGamePhase() != PHASE.ALIGNMENT)
        throw ERROR.INVALID_PHASE;
      var localPlayer = currentGame.getPlayerById(localPlayerId);
      
      localPlayer.setReady(true);
      if (currentGame.areBothPlayersReady())
        currentGame.incGamePhase();
    },
    
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
      aiField.addHorizontalShip(7,5,1);
      
      aiPlayer.setReady(true);
      if (currentGame.areBothPlayersReady())
        currentGame.incGamePhase();
      return true;
    },
    
    getCurrentGame : function() {
      return currentGame;
    }
  }
}

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
      addShip(row, col, length, 0);
      shipsLeft++;
    },
    
    addHorizontalShip : function(row, col, length) {
      addShip(row, col, 0, length);
      shipsLeft++;
    },
    
    deleteShip : function (row, col) {
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

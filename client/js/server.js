function Server() {
  var currentGame;
  var localPlayerId;
  
  localPlayerId = 0;
  currentGame = new Game();
  
  return {
    fireAt : function(row, col) {
      if (localPlayerId != currentGame.getActivePlayerId())
        return false;
      var activePlayer = currentGame.getActivePlayer();
      var opponentPlayer = currentGame.getOpponentPlayer();
      if (!activePlayer.isMoveLegit(row, col))
        return false;
      var opponentsField = opponentPlayer.getGameField();
      opponentsField.shootAt(row, col);
      activePlayer.pushMove(row, col);
      currentGame.rotatePlayer();
    },
    
    waitForOpponent : function() {
      currentGame.rotatePlayer();
    
    },
    
    getCurrentGame : function() {
      return currentGame;
    }
    
    // TODO: methods to manipulate with ship placement
  }
}

function AI() {
  var movesToDo;
  
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
  gamePhase = 0;
  
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
    }
  }
}

function Player() {
  var gameField;
  var movesHistory;

  gameField = new Field();
  movesHistory = [];
  
  return {
    getMovesHistory : function() {
      return movesHistory;
    },
    
    isMoveLegit : function(row, col) {
      var index = $.inArray(row + "x" + col, movesHistory);
      return (index == -1 ? true : false);
    },
    
    pushMove : function(row, col) {
      movesHistory.push(row + "x" + col);
    },
    
    getGameField : function() {
      return gameField;
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
    
    shootAt : function(row, col) {
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

      switch (matrix[row][col]) {
        case 0:
          matrix[row][col] = 1;
          break;
        case 1:
          break;
        case 2:
          matrix[row][col] = 3;
          if (countWholeParts(row, col) == 0)
            shipsLeft--;
          break;
        case 3:
          break;
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

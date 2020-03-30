import pieceSquareTables from "./pieceSquareTables.js";

const pieceValues = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

let positionsCalculated;

export function getBestMove(game, depth = 2) {
  if (game.gameOver()) {
    return alert("You won!");
  }
  positionsCalculated = -1;
  const start = Date.now();
  const { move, value } = minimax(depth, game, -Infinity, Infinity, true);
  const time = Date.now() - start;
  return {
    move,
    positions: positionsCalculated,
    time
  };
}

function minimax(depth, game, alpha, beta, isMax) {
  positionsCalculated++;
  if (depth === 0) {
    return { value: -evaluateBoard(game) };
  }

  let bestMove = null;
  let bestValue = isMax ? -Infinity : Infinity;
  const gameMoves = game.moves();

  for (let i = 0; i < gameMoves.length; i++) {
    const gameMove = gameMoves[i];
    game.move(gameMove);
    const { value } = minimax(depth - 1, game, alpha, beta, !isMax);
    game.undo();

    if (isMax) {
      if (value >= bestValue) {
        bestValue = value;
        bestMove = gameMove;
      }
      alpha = Math.max(alpha, bestValue);
    } else {
      if (value <= bestValue) {
        bestValue = value;
        bestMove = gameMove;
      }
      beta = Math.min(beta, bestValue);
    }
    if (beta <= alpha) {
      return { value: bestValue, move: bestMove };
    }
  }
  return { value: bestValue, move: bestMove };
}

function evaluateBoard(game) {
  let totalEvaluation = 0;
  const { history } = game
  const { board } = history[history.length-1]
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      totalEvaluation += getPieceValue(board[y][x], x, y);
    }
  }
  return totalEvaluation;
}

function getPieceValue(piece, x, y) {
  if (!piece) {
    return 0;
  }

  if ('PRNBQK'.includes(piece)) {
    return pieceValues[piece.toLowerCase()] + pieceSquareTables.white[piece.toLowerCase()][y][x];
  } else {
    return -(
      pieceValues[piece] + pieceSquareTables.black[piece.toLowerCase()][y][x]
    );
  }
}

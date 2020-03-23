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
  if (game.game_over()) {
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
  const gameMoves = game.fast_moves();

  for (let i = 0; i < gameMoves.length; i++) {
    const gameMove = gameMoves[i];
    game.fast_move(gameMove);
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
  const xAxis = "abcdefgh";
  let totalEvaluation = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      totalEvaluation += getPieceValue(game.get(`${xAxis[i]}${j + 1}`), i, j);
    }
  }
  return totalEvaluation;
}

function getPieceValue(piece, x, y) {
  if (!piece) {
    return 0;
  }

  if (piece.color === "w") {
    return pieceValues[piece.type] + pieceSquareTables.white[piece.type][x][y];
  } else {
    return -(
      pieceValues[piece.type] + pieceSquareTables.black[piece.type][x][y]
    );
  }
}

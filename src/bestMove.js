const pieceValues = {
  p: 10,
  r: 50,
  n: 30,
  b: 30,
  q: 90,
  k: 900
};
let positionsCalculated;

export function getBestMove(game, depth = 2) {
  if (game.game_over()) {
    return alert("You won!");
  }
  positionsCalculated = -1;
  const start = Date.now();
  const { move } = minimax(depth, game, -10000, 10000, true);
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
  let bestValue = isMax ? -9999 : 9999;
  const mathFn = isMax ? (a, b) => a >= b : (a, b) => a <= b;
  const gameMoves = game.fast_moves();

  for (let i = 0; i < gameMoves.length; i++) {
    const gameMove = gameMoves[i];
    game.fast_move(gameMove);

    const { value } = minimax(depth - 1, game, alpha, beta, !isMax);
    if (mathFn(value, bestValue)) {
      bestValue = value;
      bestMove = gameMove;
    }
    game.undo();
    if (isMax) {
      alpha = Math.max(alpha, bestValue);
    } else {
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
      totalEvaluation =
        totalEvaluation + getPieceValue(game.get(`${xAxis[i]}${j + 1}`));
    }
  }
  return totalEvaluation;
}

function getPieceValue(piece) {
  if (!piece) {
    return 0;
  }
  const value = pieceValues[piece.type] || 0;
  return piece.color === "w" ? value : -value;
}

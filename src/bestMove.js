const pieceValues = {
  p: 10,
  r: 50,
  n: 30,
  b: 30,
  q: 90,
  k: 9000
};
const depth = 4;
let positionsCalculated;

export function getBestMove(game) {
  if (game.game_over()) {
    return alert("You won!");
  }
  positionsCalculated = -1;
  const start = Date.now();
  const { move } = minimax(depth, game, true);
  const time = Date.now() - start;
  return {
    move,
    positions: positionsCalculated,
    time
  };
}

function minimax(depth, game, isMax) {
  positionsCalculated++;
  if (depth === 0) {
    return { value: -evaluateBoard(game) };
  }

  let bestMove = null;
  let bestValue = isMax ? -9999 : 9999;
  const mathFn = isMax ? (a, b) => a >= b : (a, b) => a <= b;

  game.fast_moves().forEach(gameMove => {
    game.fast_move(gameMove);

    const { value } = minimax(depth - 1, game, !isMax);
    if (mathFn(value, bestValue)) {
      bestValue = value;
      bestMove = gameMove;
    }
    game.undo();
  });
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

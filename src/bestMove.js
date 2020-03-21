const pieceValues = {
  p: 10,
  r: 50,
  n: 30,
  b: 30,
  q: 90,
  k: 900
};

export function getBestMove(game) {
  if (game.game_over()) {
    alert("You won!");
    return null;
  }

  const gameMoves = game.moves();
  let bestMove = null;
  let bestValue = -9999;

  for (let i = 0; i < gameMoves.length; i++) {
    const gameMove = gameMoves[i];
    game.move(gameMove);

    const boardValue = -evaluateBoard(game);
    game.undo();
    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = gameMove;
    }
  }

  return bestMove;
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
  if (piece === null) {
    return 0;
  }
  const value = pieceValues[piece.type] || 0;
  return piece.color === "w" ? value : -value;
}

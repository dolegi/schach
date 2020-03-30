import { getBestMove } from "./bestMove.js";
import Chess from "./chess.js";
import board from "./chessboard.js";

const game = Chess();
const { display } = board(({ from, to }) => {
  let move
  if (from.x === 4 && from.y === 7 && to.x === 6 && to.y === 7) { // kings side castling
    move = game.move({ from, to, from2: { x: 7, y: 7 }, to2: { x: 5, y: 7 } });
  } else if (from.x === 4 && from.y === 7 && to.x === 2 && to.y === 7) { // queen side castling
    move = game.move({ from, to, from2: { x: 0, y: 7 }, to2: { x: 3, y: 7 } });
  } else {
    move = game.move({ from, to });
  }
  if (!move) {
    return console.log("Invalid move");
  }
  display(game.fen());
  makeBestMove();
});

function makeBestMove() {
  const depth = parseInt(document.querySelector("#depth").value);
  const { move, positions, time } = getBestMove(game, depth);
  if (!move) {
    return;
  }
  renderInfo(positions, time);
  game.move(move);
  display(game.fen());

  if (game.gameOver()) {
    alert("You lost");
  }
}

function renderInfo(positions, time) {
  document.querySelector("#positions-calculated").innerText = positions;
  document.querySelector("#time-spent").innerText = `${time / 1000}s`;
  document.querySelector("#positions-per-second").innerText = `${Math.floor(
    positions / (time / 1000)
  )}`;
}

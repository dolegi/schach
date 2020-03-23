import { getBestMove } from "./bestMove.js";
import Chess from "../lib/chess.js";
import board from "./chessboard.js";

const game = new Chess();
const { display } = board(({ from, to }) => {
  const move = game.move({ from, to, promotion: "q" });
  if (!move) {
    return console.log("Invalid move");
  }
  display(game.fen());
  renderMoveHistory(game.history());
  makeBestMove();
});

function makeBestMove() {
  const depth = parseInt(document.querySelector("#depth").value);
  const { move, positions, time } = getBestMove(game, depth);
  if (!move) {
    return;
  }
  renderInfo(positions, time);
  game.fast_move(move);
  display(game.fen());
  renderMoveHistory(game.history());

  if (game.game_over()) {
    alert("You lost");
  }
}

function renderMoveHistory(moves) {
  const historyElement = document.querySelector("#move-history");
  historyElement.innerHTML = "";
  for (let i = 0; i < moves.length; i = i + 2) {
    historyElement.innerHTML += `<span>${(i + 2) / 2}. ${moves[i]} ${
      moves[i + 1] ? moves[i + 1] : " "
    }</span><br>`;
  }
}

function renderInfo(positions, time) {
  document.querySelector("#positions-calculated").innerText = positions;
  document.querySelector("#time-spent").innerText = `${time / 1000}s`;
  document.querySelector("#positions-per-second").innerText = `${Math.floor(
    positions / (time / 1000)
  )}`;
}

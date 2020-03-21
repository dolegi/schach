import { getBestMove } from "./bestMove.js";
import Chess from "../lib/chess.js";
let board;
const game = new Chess();

function onDragStart(_, piece) {
  if (
    game.in_checkmate() === true ||
    game.in_draw() === true ||
    piece.search(/^b/) !== -1
  ) {
    return false;
  }
}

function makeBestMove() {
  const depth = parseInt(document.querySelector("#depth").value);
  const { move, positions, time } = getBestMove(game, depth);
  if (!move) {
    return;
  }
  renderInfo(positions, time);
  game.fast_move(move);
  board.position(game.fen());
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

function onDrop(from, to) {
  const move = game.move({
    from,
    to,
    promotion: "q"
  });

  if (move === null) {
    return "snapback";
  }

  renderMoveHistory(game.history());
  setTimeout(makeBestMove, 250);
}

board = ChessBoard("myBoard", {
  draggable: true,
  position: "start",
  onDragStart,
  onDrop,
  onSnapEnd: () => board.position(game.fen())
});

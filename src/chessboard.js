const DEFAULT_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const unicode = {
  K: "&#9812;",
  Q: "&#9813;",
  R: "&#9814;",
  B: "&#9815;",
  N: "&#9816;",
  P: "&#9817;",
  k: "&#9818;",
  q: "&#9819;",
  r: "&#9820;",
  b: "&#9821;",
  n: "&#9822;",
  p: "&#9823;"
};
const board = document.querySelector("#board");
let from = null;
let selectedCell = null;

function display(fen) {
  fen
    .split(" ")[0]
    .split("/")
    .forEach((row, y) => {
      const cells = row.split("");
      for (let i = 0, x = 0; i < cells.length; i++) {
        if (isNaN(cells[i])) {
          board.rows[y].cells[x].innerHTML = unicode[cells[i]];
          x++;
        } else {
          const increment = parseInt(cells[i]);
          for (let j = 0; j < increment; j++) {
            board.rows[y].cells[x + j].innerHTML = "";
          }
          x += increment;
        }
      }
    });
}

function addEventListeners(callback) {
  for (let i = 0, row; (row = board.rows[i]); i++) {
    for (let j = 0, cell; (cell = row.cells[j]); j++) {
      cell.addEventListener("click", event => {
        const x = event.target.cellIndex;
        const y = event.target.parentNode.rowIndex;
        const to = `${String.fromCharCode(97 + x)}${8 - y}`;
        if (!from) {
          from = to;
          cell.classList.add("selected");
          selectedCell = cell;
        } else {
          selectedCell.classList.remove("selected");
          callback({ from, to });
          from = null;
        }
      });
    }
  }
}

export default function setup(callback, fen = DEFAULT_POSITION) {
  display(fen);
  addEventListeners(callback);

  return {
    display
  };
}

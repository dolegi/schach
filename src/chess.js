const DEFAULT_POSITION =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

let history = []

function parse(fen) {
  const [
    piecePositions,
    active,
    castling,
    enPassant,
    halfMove,
    fullMove
  ] = fen.split(' ')

  let board = piecePositions 
    .split("/")
    .map(row => {
      let parsedRow = []
      for (let i = 0; i < row.length; i++) {
        if (isNaN(row[i])) {
          parsedRow.push(row[i]) 
        } else {
          for (let j = 0; j < parseInt(row[i]); j++) {
            parsedRow.push(null)
          }
        }
      }
      return parsedRow
    })

  return {
    board,
    active,
    castling,
    enPassant,
    halfMove: parseInt(halfMove),
    fullMove: parseInt(fullMove)
  }
}

module.exports = function chess(fen = DEFAULT_POSITION) {
  history = [parse(fen)]

  return {
    history,
    parse
    // move,
    // undo,

    // in_check,
    // in_checkmate,
    // in_stalemate,
    // in_draw,
    // insufficient_material,
    // in_threefold_repetition,
    // game_over,
  }
}

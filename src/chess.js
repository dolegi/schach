const DEFAULT_POSITION =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const moves = require('./moves')

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
  const history = [parse(fen)]

  function lastMove() {
    return history[history.length-1]
  }

  function gameOver () {
    const { board, active, castling } = lastMove()
    return moves(board, active, castling).length === 0
  }

  function move(move) {
    const lMove = lastMove()
    const board = JSON.parse(JSON.stringify(lMove.board))
    board[move.to.y][move.to.x] = board[move.from.y][move.from.x]
    board[move.from.y][move.from.x] = null

    history.push({
      board,
      active: lMove.active === 'w' ? 'b' : 'w',
      castling: lMove,
      enPassant: lMove.enPassant,
      halfMove: lMove.halfMove,
      fullMove: lMove.fullMove + 1
    })
  }

  function fenFn() {
    const {
      board,
      active,
      castling,
      enPassant,
      halfMove,
      fullMove
    } = lastMove()
    let fen = ''
    for (let y = 0; y < board.length; y++) {
      const row = board[y]
      for (let x = 0; x < row.length; x++) {
        const cell = row[x]
        if (cell === null) {
          if (!isNaN(fen[fen.length-1])) {
            const prev = parseInt(fen[fen.length-1])
            fen = fen.slice(0, fen.length-1)
            fen += (prev + 1)
          } else {
            fen += 1
          }
        } else {
          fen += cell
        }
      }
      if (y !== board.length-1) {
        fen += '/'
      }
    }
    fen += ' ' + active
    fen += ' ' + castling
    fen += ' ' + enPassant
    fen += ' ' + halfMove
    fen += ' ' + fullMove 

    return fen
  }

  return {
    history,
    parse,
    moves,
    gameOver,
    move,
    fen: fenFn,
    undo: () => history.pop()

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

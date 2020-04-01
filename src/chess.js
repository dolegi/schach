const DEFAULT_POSITION =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
import moves from './moves.js'

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

export default function chess(fen = DEFAULT_POSITION) {
  const history = [parse(fen)]

  function lastMove() {
    return history[history.length-1]
  }

  function gameOver () {
    const { board, active, castling } = lastMove()
    return moves(board, active, castling).length === 0
  }

  function move(move) {
    const moves = getMoves()
    if (!moves.some(m =>
      m.to.x === move.to.x
      && m.to.y === move.to.y
      && m.from.x === move.from.x
      && m.from.y === move.from.y)) {
      return false
    }
    const lMove = lastMove()
    const board = JSON.parse(JSON.stringify(lMove.board))
    board[move.to.y][move.to.x] = board[move.from.y][move.from.x]
    board[move.from.y][move.from.x] = null
    if (move.from2 && move.to2) { //castling
      board[move.to2.y][move.to2.x] = board[move.from2.y][move.from2.x]
      board[move.from2.y][move.from2.x] = null

      if (lMove.active === 'w') {
        castling = castling.replace('KQ', '')
      } else {
        castling = castling.replace('KQ', '')
      }
      if (castling.length === 0) {
        castling = '-'
      }
    }

    history.push({
      board,
      active: lMove.active === 'w' ? 'b' : 'w',
      castling: lMove.castling,
      enPassant: lMove.enPassant,
      halfMove: lMove.halfMove,
      fullMove: lMove.fullMove + 1
    })

    return true
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

  function getMoves() {
    const { board, active, castling } = lastMove()
    return moves(board, active, castling)
  }

  return {
    history,
    parse,
    moves: getMoves,
    gameOver,
    move,
    fen: fenFn,
    undo: () => history.pop()
  }
}

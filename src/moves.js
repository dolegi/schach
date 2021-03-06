const BLACK_PIECES = 'prnbqk'
const WHITE_PIECES = 'PRNBQK'


export default function moves(board, active, castling = '-') {
  const ownPieces = active === 'w' ? WHITE_PIECES : BLACK_PIECES
  const oppPieces = active === 'w' ? BLACK_PIECES : WHITE_PIECES
  const ownKing = active === 'w' ? 'K' : 'k'
  const oppKing = active === 'w' ? 'k' : 'K'
  const oppKnight = active === 'w' ? 'n' : 'N'
  const opponent = active === 'w' ? 'b' : 'w'

  function attacked(board, x, y) {
    const directions = [
      { x: -1, y: -1, b: 'bq', w: 'BQ' },
      { x: -1, y: +1, b: 'bq', w: 'BQ' },
      { x: -1, y: 0, b: 'rq', w: 'RQ' },
      { x: +1, y: -1, b: 'bq', w: 'BQ' },
      { x: +1, y: +1, b: 'bq', w: 'BQ' },
      { x: +1, y: 0, b: 'rq', w: 'RQ' },
      { x: 0, y: -1, b: 'rq', w: 'RQ' },
      { x: 0, y: +1, b: 'rq', w: 'RQ' }
    ]

    for (let i = 0; i < directions.length; i++) {
      let direction = directions[i]

      let to = { x: x+direction.x, y: y+direction.y }
      for (let j = 0; j < 7; j++) { // pieces can move up to 7 squares
        if (!board[to.y] || board[to.y][to.x] === undefined) { // edge of board
          break
        }
        if (direction[opponent].includes(board[to.y][to.x])) { // attacked
          return true
        }
        if (to.x === x+direction.x &&
          to.y === y+direction.y &&
          board[to.y][to.x] === oppKing) { // attacked by king
          return true
        }
        if (board[to.y][to.x] !== null) { // blocked by piece
          break
        }
        to = { x: to.x+direction.x, y: to.y+direction.y }
      }
    }

    // attacked by pawn
    if (active === 'w' && board[y-1] && (board[y-1][x-1] === 'p' || board[y-1][x+1] === 'p')) {
      return true
    }
    if (active === 'b' && board[y+1] && (board[y+1][x-1] === 'P' || board[y+1][x+1] === 'P')) {
      return true
    }

    // attacked by knight
    const knightMoves = [
      { x: x-1, y: y-2 },
      { x: x-1, y: y+2 },
      { x: x+1, y: y-2 },
      { x: x+1, y: y+2 },
      { x: x+2, y: y-1 },
      { x: x+2, y: y+1 },
      { x: x-2, y: y+1 },
      { x: x-2, y: y-1 }
    ]

    for (let i = 0; i < knightMoves.length; i++) {
      const { x: xd, y: yd }  = knightMoves[i]
      if (board[yd] && board[yd][xd] === oppKnight) {
        return true
      }
    }

    return false
  }

  function inCheck(board) {
    let pos = {}
    for (let y = 0 ; y < board.length; y++) {
      const row = board[y]
      if (row.includes(ownKing)) {
        pos.y = y
        for (let x = 0 ; x < row.length; x++) {
          if (row[x] === ownKing) {
            pos.x = x
            break
          }
        }
        break
      }
    }

    return attacked(board, pos.x, pos.y)
  }

  function addMove(board, move) {
    const originalSquare = board[move.to.y][move.to.x] 
    board[move.to.y][move.to.x] = board[move.from.y][move.from.x]
    board[move.from.y][move.from.x] = null

    if (inCheck(board)) {
      board[move.from.y][move.from.x] = board[move.to.y][move.to.x]
      board[move.to.y][move.to.x] = originalSquare
      return []
    }
    board[move.from.y][move.from.x] = board[move.to.y][move.to.x]
    board[move.to.y][move.to.x] = originalSquare
    return move
  }

  function getPawnMoves(x, y, direction, startRow) {
    let moves = []
    if (board[y+direction] && board[y+direction][x] === null) {
      moves = moves.concat(addMove(board, { from: { x, y }, to: { x, y: y+direction } }))
    }
    if (y === startRow && board[y+direction] && board[y+direction][x] === null && board[y+(direction*2)] && board[y+(direction*2)][x] === null) {
      moves = moves.concat(addMove(board, { from: { x, y }, to: { x, y: y+(direction*2) } }))
    }
    if (board[y+direction] && board[y+direction][x-1] && oppPieces.includes(board[y+direction][x-1])) {
      moves = moves.concat(addMove(board, { from: { x, y }, to: { x: x-1, y: y+direction } }))
    }
    if (board[y+direction] && board[y+direction][x+1] && oppPieces.includes(board[y+direction][x+1])) {
      moves = moves.concat(addMove(board, { from: { x, y }, to: { x: x+1, y: y+direction } }))
    }
    return moves
  }

  function getKnightMoves(x, y) {
    let moves = []
    ;[
      { x: x-1, y: y-2 },
      { x: x-1, y: y+2 },
      { x: x+1, y: y-2 },
      { x: x+1, y: y+2 },
      { x: x+2, y: y-1 },
      { x: x+2, y: y+1 },
      { x: x-2, y: y+1 },
      { x: x-2, y: y-1 }
    ].forEach(to => {
      if (board[to.y] && (board[to.y][to.x] === null || oppPieces.includes(board[to.y][to.x]))) {
        moves = moves.concat(addMove(board, { from: { x, y }, to }))
      }
    })
    return moves
  }

  function getDirectionMoves(x, y, xDirection, yDirection) {
    let moves = []
    let blocked = false

    let to = { x: x+xDirection, y: y+yDirection }
    while (!blocked) {
      if (!board[to.y] || board[to.y][to.x] === undefined) { // edge of board
        blocked = true
        break
      }
      if (ownPieces.includes(board[to.y][to.x])) { // blocked by own piece
        blocked = true
        break
      }
      if (oppPieces.includes(board[to.y][to.x])) { // take piece
        blocked = true
      }
      moves = moves.concat(addMove(board, { from: { x, y }, to }))
      to = { x: to.x+xDirection, y: to.y+yDirection }
    }
    return moves
  }

  function getBishopMoves(x, y) {
    return [].concat(
      getDirectionMoves(x, y, -1, -1),
      getDirectionMoves(x, y, -1, +1),
      getDirectionMoves(x, y, +1, +1),
      getDirectionMoves(x, y, +1, -1),
    )
  }

  function getRookMoves(x, y) {
    return [].concat(
      getDirectionMoves(x, y, +1, 0),
      getDirectionMoves(x, y, 0, +1),
      getDirectionMoves(x, y, -1, 0),
      getDirectionMoves(x, y, 0, -1),
    )
  }

  function getKingMoves(x, y) {
    let moves = []
    ;[
      { x: x-1, y: y-1 },
      { x: x-1, y },
      { x: x-1, y: y+1 },
      { x: x+1, y: y-1 },
      { x: x+1, y },
      { x: x+1, y: y+1 },
      { x, y: y-1 },
      { x, y: y+1 }
    ].forEach(to => {
      if (board[to.y] && (board[to.y][to.x] === null || oppPieces.includes(board[to.y][to.x]))) {
        moves = moves.concat(addMove(board, { from: { x, y }, to }))
      }
    })

    const { row, kSide, qSide } = {
      w: { row: 7, kSide: 'K', qSide: 'Q' },
      b: { row: 0, kSide: 'k', qSide: 'q' }
    }[active]

    function checkForCheck (move) {
      const originalSquare = board[move.to.y][move.to.x] 
      board[move.to.y][move.to.x] = board[move.from.y][move.from.x]
      board[move.from.y][move.from.x] = null
      const check = inCheck(board)

      board[move.from.y][move.from.x] = board[move.to.y][move.to.x]
      board[move.to.y][move.to.x] = originalSquare
      return check
    }

    if (!inCheck(board)) {
      if (castling.includes(kSide)
        && board[row][6] === null
        && !checkForCheck({ from: { x, y }, to: { x: 6, y } })
        && board[row][5] === null
        && !checkForCheck({ from: { x, y }, to: { x: 5, y } })) {
        moves = moves.concat(addMove(board, {
          from: { x, y }, to: { x: 6, y },
          from2: { x: 7, y: row }, to2: { x: 5, y: row }
        }))
      }
      if (castling.includes(qSide)
        && board[row][1] === null
        && !checkForCheck({ from: { x, y }, to: { x: 1, y } })
        && board[row][2] === null
        && !checkForCheck({ from: { x, y }, to: { x: 2, y } })
        && board[row][3] === null
        && !checkForCheck({ from: { x, y }, to: { x: 3, y } })) {
        moves = moves.concat(addMove(board, {
          from: { x, y }, to: { x: 2, y },
          from2: { x: 0, y: row }, to2: { x: 3, y: row }
        }))
      }
    }

    return moves
  }

  function getMoves(pieceMoves) {
    let moves = []

    for (let y = 0; y < board.length; y++) {
      const row = board[y]
      for (let x = 0; x < row.length; x++) {
        const square = row[x]
        if (!pieceMoves[square] || oppPieces.includes(pieceMoves[square])) {
          continue 
        }
        moves = moves.concat(pieceMoves[square](x, y))
      }
    }

    return moves
  }

  const whitePieces = {
    P: (x, y) => getPawnMoves(x, y, -1, 6),
    N: getKnightMoves,
    B: getBishopMoves,
    R: getRookMoves,
    Q: (x, y) => getBishopMoves(x, y).concat(getRookMoves(x, y)),
    K: getKingMoves
  }
  const blackPieces = {
    p: (x, y) => getPawnMoves(x, y, 1, 1),
    n: getKnightMoves,
    b: getBishopMoves,
    r: getRookMoves,
    q: (x, y) => getBishopMoves(x, y).concat(getRookMoves(x, y)),
    k: getKingMoves
  }

  if (active === 'w') {
    return getMoves(whitePieces)
  } else {
    return getMoves(blackPieces)
  }
}

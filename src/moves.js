const BLACK_PIECES = 'prnbqk'
const WHITE_PIECES = 'PRNBQK'

function getWhitePawnMoves(board, x, y) {
  const moves = []
  if (board[y-1] && board[y-1][x] === null) {
    moves.push({ from: { x, y }, to: { x, y: y-1 } })
  }
  if (y === 6 && board[y-2] && board[y-2][x] === null) {
    moves.push({ from: { x, y }, to: { x, y: y-2 } })
  }
  if (board[y-1] && board[y-1][x-1] && BLACK_PIECES.includes(board[y-1][x-1])) {
    moves.push({ from: { x, y }, to: { x: x-1, y: y-1 } })
  }
  if (board[y-1] && board[y-1][x+1] && BLACK_PIECES.includes(board[y-1][x+1])) {
    moves.push({ from: { x, y }, to: { x: x+1, y: y-1 } })
  }
  return moves
}

function getWhiteKnightMoves(board, x, y) {
  const moves = []
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
    if (board[to.y] && (board[to.y][to.x] === null || BLACK_PIECES.includes(board[to.y][to.x]))) {
      moves.push({ from: { x, y }, to })
    }
  })
  return moves
}

function getWhiteDirectionMoves(board, x, y, xDirection, yDirection) {
  const moves = []
  let blocked = false

  let to = { x: x+xDirection, y: y+yDirection }
  while (!blocked) {
    if (!board[to.y] || board[to.y][to.x] === undefined) { // edge of board
      blocked = true
      continue
    }
    if (WHITE_PIECES.includes(board[to.y][to.x])) { // blocked by own piece
      blocked = true
      continue
    }
    if (BLACK_PIECES.includes(board[to.y][to.x])) { // take piece
      blocked = true
    }
    moves.push({ from: { x, y }, to })
    to = { x: to.x+xDirection, y: to.y+yDirection }
  }
  return moves
}

function getWhiteBishopMoves(board, x, y) {
  return [].concat(
    getWhiteDirectionMoves(board, x, y, -1, -1),
    getWhiteDirectionMoves(board, x, y, -1, +1),
    getWhiteDirectionMoves(board, x, y, +1, +1),
    getWhiteDirectionMoves(board, x, y, +1, -1),
  )
}

function getWhiteRookMoves(board, x, y) {
  return [].concat(
    getWhiteDirectionMoves(board, x, y, +1, 0),
    getWhiteDirectionMoves(board, x, y, -1, 0),
    getWhiteDirectionMoves(board, x, y, 0, +1),
    getWhiteDirectionMoves(board, x, y, 0, -1),
  )
}

function getWhiteKingMoves(board, x, y) {
  const moves = []
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
    if (board[to.y] && (board[to.y][to.x] === null || BLACK_PIECES.includes(board[to.y][to.x]))) {
      moves.push({ from: { x, y }, to })
    }
  })
  return moves
}

function getWhiteMoves(board) {
  let moves = []

  for (let y = 0; y < board.length; y++) {
    const row = board[y]
    for (let x = 0; x < row.length; x++) {
      const square = row[x]
      if (!square) {
        continue 
      }
      if (square === 'P') {
        moves = moves.concat(getWhitePawnMoves(board, x, y))
      }
      if (square === 'N') {
        moves = moves.concat(getWhiteKnightMoves(board, x, y))
      }
      if (square === 'B') {
        moves = moves.concat(getWhiteBishopMoves(board, x, y))
      }
      if (square === 'R') {
        moves = moves.concat(getWhiteRookMoves(board, x, y))
      }
      if (square === 'Q') {
        moves = moves.concat(
          getWhiteBishopMoves(board, x, y), 
          getWhiteRookMoves(board, x, y)
        )
      }
      if (square === 'K') {
        moves = moves.concat(getWhiteKingMoves(board, x, y))
      }
    }
  }

  return moves
}

module.exports = function moves(board, active) {
  if (active === 'w') {
    return getWhiteMoves(board)
  } else {
    return []
  }
}

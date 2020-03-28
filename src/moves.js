const BLACK_PIECES = 'prnbqk'
const WHITE_PIECES = 'PRNBQK'

const ownPieces = active => active === 'w' ? WHITE_PIECES : BLACK_PIECES
const oppPieces = active => active === 'w' ? BLACK_PIECES : WHITE_PIECES

module.exports = function moves(board, active) {
  // function addMove(board, move) {
  //   const newBoard = JSON.parse(JSON.stringify(board))
  //   newBoard[move.from.y][move.from.x] = newBoard[move.to.y][move.to.x]
    
  //   if (inCheck(board, active)) {

  //   }

  // }

  function getPawnMoves(board, x, y, direction, startRow) {
    const moves = []
    if (board[y+direction] && board[y+direction][x] === null) {
      moves.push({ from: { x, y }, to: { x, y: y+direction } })
    }
    if (y === startRow && board[y+(direction*2)] && board[y+(direction*2)][x] === null) {
      moves.push({ from: { x, y }, to: { x, y: y+(direction*2) } })
    }
    if (board[y+direction] && board[y+direction][x-1] && oppPieces(active).includes(board[y+direction][x-1])) {
      moves.push({ from: { x, y }, to: { x: x-1, y: y+direction } })
    }
    if (board[y+direction] && board[y+direction][x+1] && oppPieces(active).includes(board[y+direction][x+1])) {
      moves.push({ from: { x, y }, to: { x: x+1, y: y+direction } })
    }
    return moves
  }

  function getKnightMoves(board, x, y) {
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
      if (board[to.y] && (board[to.y][to.x] === null || oppPieces(active).includes(board[to.y][to.x]))) {
        moves.push({ from: { x, y }, to })
      }
    })
    return moves
  }

  function getDirectionMoves(board, x, y, xDirection, yDirection) {
    const moves = []
    let blocked = false

    let to = { x: x+xDirection, y: y+yDirection }
    while (!blocked) {
      if (!board[to.y] || board[to.y][to.x] === undefined) { // edge of board
        blocked = true
        continue
      }
      if (ownPieces(active).includes(board[to.y][to.x])) { // blocked by own piece
        blocked = true
        continue
      }
      if (oppPieces(active).includes(board[to.y][to.x])) { // take piece
        blocked = true
      }
      moves.push({ from: { x, y }, to })
      to = { x: to.x+xDirection, y: to.y+yDirection }
    }
    return moves
  }

  function getBishopMoves(board, x, y) {
    return [].concat(
      getDirectionMoves(board, x, y, -1, -1),
      getDirectionMoves(board, x, y, -1, +1),
      getDirectionMoves(board, x, y, +1, +1),
      getDirectionMoves(board, x, y, +1, -1),
    )
  }

  function getRookMoves(board, x, y) {
    return [].concat(
      getDirectionMoves(board, x, y, +1, 0),
      getDirectionMoves(board, x, y, 0, +1),
      getDirectionMoves(board, x, y, -1, 0),
      getDirectionMoves(board, x, y, 0, -1),
    )
  }

  function getKingMoves(board, x, y) {
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
      if (board[to.y] && (board[to.y][to.x] === null || oppPieces(active).includes(board[to.y][to.x]))) {
        moves.push({ from: { x, y }, to })
      }
    })
    return moves
  }

  function getMoves(board, pieceMoves) {
    let moves = []

    for (let y = 0; y < board.length; y++) {
      const row = board[y]
      for (let x = 0; x < row.length; x++) {
        const square = row[x]
        if (!pieceMoves[square]) {
          continue 
        }
        moves = moves.concat(pieceMoves[square](board, x, y))
      }
    }

    return moves
  }

  const whitePieces = {
    P: (board, x, y) => getPawnMoves(board, x, y, -1, 6),
    N: getKnightMoves,
    B: getBishopMoves,
    R: getRookMoves,
    Q: (board, x, y) => getBishopMoves(board, x, y).concat(getRookMoves(board, x, y)),
    K: getKingMoves
  }
  const blackPieces = {
    p: (board, x, y) => getPawnMoves(board, x, y, 1, 1),
    n: getKnightMoves,
    b: getBishopMoves,
    r: getRookMoves,
    q: (board, x, y) => getBishopMoves(board, x, y).concat(getRookMoves(board, x, y)),
    k: getKingMoves
  }

  if (active === 'w') {
    return getMoves(board, whitePieces)
  } else {
    return getMoves(board, blackPieces)
  }
}

import chess from '../src/chess'
import moves from '../src/moves'

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

describe('moves', () => {
  test('50 moves in 20ms', () => {
    const { history } = chess()
    const { board, active } = history.pop()
    let boards = []
    for (let i = 0; i < 50; i++) {
      boards.push(JSON.parse(JSON.stringify(shuffle(board))))
    }
    const start = Date.now()
    for (let i = 0; i < 50; i++) {
      moves(boards[i], active)
    }
    const end = (Date.now() - start)
    console.log(end)

    expect(end).toBeLessThan(20)
  })
})

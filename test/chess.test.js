const chess = require('../src/chess')

const DEFAULT_POSITION =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

describe('fen', () => {
  test('default position', () => {
    const game = chess(DEFAULT_POSITION)

    expect(game.fen()).toEqual(DEFAULT_POSITION)
  })
})

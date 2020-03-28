const chess = require('../src/chess')
const moves = require('../src/moves')

describe('moves', () => {
  describe('white', () => {

    test('starting position', () => {
      const { history } = chess()
      const { board, active } = history.pop()
      expect(moves(board, active).length).toEqual(20)
    })

    test('knights can move', () => {
      const position = 'rnbqkbnr/pppppppp/8/6N1/8/8/PPP1PPPP/RNBQKB1R w KQkq - 0 1'
      const { history } = chess(position)
      const { board, active } = history.pop()

      expect(moves(board, active).length).toEqual(34)
    })

    test('bishops can move', () => {
      const position = 'rnbqkbnr/pppppppp/8/6B1/8/8/P1P1PPPP/RNBQK1NR w KQkq - 0 1'
      const { history } = chess(position)
      const { board, active } = history.pop()

      expect(moves(board, active).length).toEqual(37)
    })

    test('rooks can move', () => {
      const position = 'rnbqkbnr/pppppppp/8/6R1/8/8/1PPPPPPP/RNBQKBNR w KQkq - 0 1'
      const { history } = chess(position)
      const { board, active } = history.pop()

      expect(moves(board, active).length).toEqual(35)
    })

    test('queens can move', () => {
      const position = 'rnbqkbnr/pppppppp/8/6Q1/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1'
      const { history } = chess(position)
      const { board, active } = history.pop()

      expect(moves(board, active).length).toEqual(38)
    })

    test('kings can move', () => {
      const position = 'rnbqkbnr/ppppp1pp/8/8/5pK1/8/PPPPPPPP/RNBQ1BNR w KQkq - 0 1'
      const { history } = chess(position)
      const { board, active } = history.pop()

      expect(moves(board, active).length).toEqual(27)
    })
  })
})

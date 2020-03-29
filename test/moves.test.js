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

      expect(moves(board, active).length).toEqual(26)
    })

    describe('when in check', () => {
      test('pawn check', () => {
        const position = 'rnbqkbnr/pppp1ppp/8/5p2/6K1/8/PPPPPPPP/RNBQ1BNR w KQkq - 0 1'
        const { history } = chess(position)
        const { board, active } = history.pop()

        expect(moves(board, active).length).toEqual(6)
      })

      test('rook, check can be blocked', () => {
        const position = 'rnbqkbn1/pppppprp/8/8/7B/6K1/PPPPPPPP/RNBQ2NR w KQkq - 0 1'
        const { history } = chess(position)
        const { board, active } = history.pop()

        expect(moves(board, active).length).toEqual(4)
      })
    })
  })

  describe('black', () => {
    test('knights can move', () => {
      const position = 'rnbqkb1r/ppp1pppp/8/8/6n1/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1'
      const { history } = chess(position)
      const { board, active } = history.pop()

      expect(moves(board, active).length).toEqual(34)
    })

    test('bishops can move', () => {
      const position = 'rnbqk1nr/p1p1pppp/8/8/6b1/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1'
      const { history } = chess(position)
      const { board, active } = history.pop()

      expect(moves(board, active).length).toEqual(37)
    })

    test('rooks can move', () => {
      const position = 'rnbqkbnr/1ppppppp/8/8/6r1/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1'
      const { history } = chess(position)
      const { board, active } = history.pop()

      expect(moves(board, active).length).toEqual(35)
    })

    test('queens can move', () => {
      const position = 'rnb1kbnr/pppppppp/8/8/6q1/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1'
      const { history } = chess(position)
      const { board, active } = history.pop()

      expect(moves(board, active).length).toEqual(38)
    })

    test('kings can move', () => {
      const position = 'rnbq1bnr/pppppppp/8/5Pk1/8/8/PPPPP1PP/RNBQKBNR b KQkq - 0 1'
      const { history } = chess(position)
      const { board, active } = history.pop()

      expect(moves(board, active).length).toEqual(26)
    })

    describe('when in check', () => {
      test('pawn check', () => {
        const position = 'rnbq1bnr/pppppppp/8/6k1/5P2/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1'
        const { history } = chess(position)
        const { board, active } = history.pop()

        expect(moves(board, active).length).toEqual(6)
      })

      test('rook, check can be blocked', () => {
        const position = 'rnbq2nr/pppppppp/6k1/7b/8/8/PPPPPPRP/RNBQKBN1 b KQkq - 0 1'
        const { history } = chess(position)
        const { board, active } = history.pop()

        expect(moves(board, active).length).toEqual(4)
      })
    })
  })
})

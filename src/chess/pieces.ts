import type { Color, PieceType, ParsedPiece, CastlingRights } from '../types'

export const PIECES: Record<Color, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
}

export const INITIAL_BOARD: (string | null)[][] = [
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
]

export const INITIAL_CASTLING_RIGHTS: CastlingRights = {
  whiteKingSide: true,
  whiteQueenSide: true,
  blackKingSide: true,
  blackQueenSide: true
}

const TYPE_MAP: Record<string, PieceType> = {
  p: 'pawn',
  r: 'rook',
  n: 'knight',
  b: 'bishop',
  q: 'queen',
  k: 'king'
}

export function parsePiece(notation: string | null): ParsedPiece | null {
  if (!notation) return null
  const color: Color = notation[0] === 'w' ? 'white' : 'black'
  const type = TYPE_MAP[notation[1]]
  if (!type) return null
  return { color, type }
}

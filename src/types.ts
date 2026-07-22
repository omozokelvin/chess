export type Color = 'white' | 'black'

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'

export interface ParsedPiece {
  color: Color
  type: PieceType
}

export interface Position {
  row: number
  col: number
}

export interface MoveRecord {
  from: string
  to: string
  piece: string
}

export type GameStatus =
  | 'playing'
  | 'check'
  | 'stalemate'
  | `checkmate-${Color}`

export type Board = (string | null)[][]

export interface CastlingRights {
  whiteKingSide: boolean
  whiteQueenSide: boolean
  blackKingSide: boolean
  blackQueenSide: boolean
}

export type EnPassantTarget = Position | null

export type PromotionChoice = 'queen' | 'rook' | 'bishop' | 'knight'

export interface MoveInfo {
  from: Position
  to: Position
  piece: string
  captured?: string
  isCastling?: 'king-side' | 'queen-side'
  isEnPassant?: boolean
  promotion?: PromotionChoice
}

export interface GameSave {
  board: Board
  turn: Color
  castlingRights: CastlingRights
  enPassantTarget: EnPassantTarget
  moveHistory: MoveRecord[]
  capturedPieces: string[]
  gameStatus: GameStatus
}

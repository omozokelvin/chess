import type { Board, Color, Position } from '../types'
import { parsePiece } from './pieces'

export function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

export function getValidMoves(board: Board, row: number, col: number): Position[] {
  const piece = board[row][col]
  if (!piece) return []
  
  const parsed = parsePiece(piece)
  if (!parsed) return []
  
  const moves: Position[] = []
  
  switch (parsed.type) {
    case 'pawn':
      moves.push(...getPawnMoves(board, row, col, parsed.color))
      break
    case 'rook':
      moves.push(...getRookMoves(board, row, col))
      break
    case 'knight':
      moves.push(...getKnightMoves(board, row, col))
      break
    case 'bishop':
      moves.push(...getBishopMoves(board, row, col))
      break
    case 'queen':
      moves.push(...getQueenMoves(board, row, col))
      break
    case 'king':
      moves.push(...getKingMoves(board, row, col))
      break
  }
  
  // Filter moves that would leave king in check
  return moves.filter(move => {
    const newBoard = board.map(r => [...r])
    newBoard[move.row][move.col] = newBoard[row][col]
    newBoard[row][col] = null
    return !isKingInCheck(newBoard, parsed.color)
  })
}

function getPawnMoves(board: Board, row: number, col: number, color: Color): Position[] {
  const moves: Position[] = []
  const direction = color === 'white' ? -1 : 1
  const startRow = color === 'white' ? 6 : 1
  
  // Forward one square
  if (isValidPosition(row + direction, col) && !board[row + direction][col]) {
    moves.push({ row: row + direction, col })
    // Forward two squares from starting position
    if (row === startRow && !board[row + 2 * direction][col]) {
      moves.push({ row: row + 2 * direction, col })
    }
  }
  
  // Diagonal captures
  const diagonalOffsets = [-1, 1]
  for (const offset of diagonalOffsets) {
    const newCol = col + offset
    if (isValidPosition(row + direction, newCol)) {
      const target = board[row + direction][newCol]
      if (target && parsePiece(target)?.color !== color) {
        moves.push({ row: row + direction, col: newCol })
      }
    }
  }
  
  return moves
}

function getRookMoves(board: Board, row: number, col: number): Position[] {
  const directions: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]]
  return getSlidingMoves(board, row, col, directions)
}

function getBishopMoves(board: Board, row: number, col: number): Position[] {
  const directions: [number, number][] = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
  return getSlidingMoves(board, row, col, directions)
}

function getQueenMoves(board: Board, row: number, col: number): Position[] {
  const directions: [number, number][] = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ]
  return getSlidingMoves(board, row, col, directions)
}

function getSlidingMoves(
  board: Board,
  row: number,
  col: number,
  directions: [number, number][]
): Position[] {
  const moves: Position[] = []
  const parsed = parsePiece(board[row][col])
  if (!parsed) return moves
  
  for (const [dr, dc] of directions) {
    let r = row + dr
    let c = col + dc
    while (isValidPosition(r, c)) {
      const target = board[r][c]
      if (!target) {
        moves.push({ row: r, col: c })
      } else {
        if (parsePiece(target)?.color !== parsed.color) {
          moves.push({ row: r, col: c })
        }
        break
      }
      r += dr
      c += dc
    }
  }
  
  return moves
}

function getKnightMoves(board: Board, row: number, col: number): Position[] {
  const offsets: [number, number][] = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ]
  const moves: Position[] = []
  const parsed = parsePiece(board[row][col])
  if (!parsed) return moves
  
  for (const [dr, dc] of offsets) {
    const r = row + dr
    const c = col + dc
    if (isValidPosition(r, c)) {
      const target = board[r][c]
      if (!target || parsePiece(target)?.color !== parsed.color) {
        moves.push({ row: r, col: c })
      }
    }
  }
  
  return moves
}

function getKingMoves(board: Board, row: number, col: number): Position[] {
  const offsets: [number, number][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ]
  const moves: Position[] = []
  const parsed = parsePiece(board[row][col])
  if (!parsed) return moves
  
  for (const [dr, dc] of offsets) {
    const r = row + dr
    const c = col + dc
    if (isValidPosition(r, c)) {
      const target = board[r][c]
      if (!target || parsePiece(target)?.color !== parsed.color) {
        moves.push({ row: r, col: c })
      }
    }
  }
  
  return moves
}

export function isKingInCheck(board: Board, color: Color): boolean {
  // Find the king position
  let kingPos: Position | null = null
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece && parsePiece(piece)?.color === color && parsePiece(piece)?.type === 'king') {
        kingPos = { row: r, col: c }
        break
      }
    }
    if (kingPos) break
  }
  
  if (!kingPos) return false
  
  const opponentColor: Color = color === 'white' ? 'black' : 'white'
  
  // Check if any opponent piece can attack the king
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece && parsePiece(piece)?.color === opponentColor) {
        const moves = getRawMoves(board, r, c)
        if (moves.some(m => m.row === kingPos!.row && m.col === kingPos!.col)) {
          return true
        }
      }
    }
  }
  
  return false
}

function getRawMoves(board: Board, row: number, col: number): Position[] {
  // Same as getValidMoves but without checking for leaving king in check
  const piece = board[row][col]
  if (!piece) return []
  
  const parsed = parsePiece(piece)
  if (!parsed) return []
  
  switch (parsed.type) {
    case 'pawn':
      return getPawnMoves(board, row, col, parsed.color)
    case 'rook':
      return getRookMoves(board, row, col)
    case 'knight':
      return getKnightMoves(board, row, col)
    case 'bishop':
      return getBishopMoves(board, row, col)
    case 'queen':
      return getQueenMoves(board, row, col)
    case 'king':
      return getKingMoves(board, row, col)
  }
  
  return []
}

export function hasLegalMoves(board: Board, color: Color): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece && parsePiece(piece)?.color === color) {
        const moves = getValidMoves(board, r, c)
        if (moves.length > 0) return true
      }
    }
  }
  return false
}

export function isCheckmate(board: Board, color: Color): boolean {
  return isKingInCheck(board, color) && !hasLegalMoves(board, color)
}

export function isStalemate(board: Board, color: Color): boolean {
  return !isKingInCheck(board, color) && !hasLegalMoves(board, color)
}

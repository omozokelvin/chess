import type { ReactNode } from 'react'
import { PIECES, parsePiece } from '../chess/pieces'

interface PieceProps {
  piece: string | null
}

export default function Piece({ piece }: PieceProps): ReactNode {
  const parsed = parsePiece(piece)
  if (!parsed) return null
  
  const symbol = PIECES[parsed.color][parsed.type]
  
  return (
    <span className={`piece piece-${parsed.color}`}>
      {symbol}
    </span>
  )
}

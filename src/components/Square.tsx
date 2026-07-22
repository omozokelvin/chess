import type { ReactNode } from 'react'
import Piece from './Piece'

interface SquareProps {
  piece: string | null
  squareColor: string
  isValidMove: boolean
  onClick: () => void
}

export default function Square({ piece, squareColor, isValidMove, onClick }: SquareProps): ReactNode {
  return (
    <div 
      className={`square ${squareColor}`}
      onClick={onClick}
    >
      {isValidMove && !piece && (
        <div className="valid-move-indicator" />
      )}
      {isValidMove && piece && (
        <div className="valid-capture-indicator" />
      )}
      {piece && <Piece piece={piece} />}
    </div>
  )
}

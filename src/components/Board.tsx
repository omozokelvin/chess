import type { Board, Position } from '../types'
import Square from './Square'

interface BoardProps {
  board: Board
  onSquareClick: (row: number, col: number) => void
  selectedSquare: Position | null
  validMoves: Position[]
}

export default function Board({ board, onSquareClick, selectedSquare, validMoves }: BoardProps) {
  const getSquareColor = (row: number, col: number): string => {
    const isLight = (row + col) % 2 === 0
    const isSelected = selectedSquare?.row === row && selectedSquare?.col === col
    const isValidMove = validMoves.some(m => m.row === row && m.col === col)
    
    if (isSelected) return 'selected'
    if (isValidMove) return 'valid-move'
    return isLight ? 'light' : 'dark'
  }

  return (
    <div className="chess-board">
      {/* Column labels */}
      <div className="board-labels top-labels">
        <div></div>
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
          <div key={letter} className="label">{letter}</div>
        ))}
        <div></div>
      </div>
      
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {/* Row labels */}
          <div className="row-label">{8 - rowIndex}</div>
          
          {row.map((piece, colIndex) => (
            <Square
              key={colIndex}
              piece={piece}
              squareColor={getSquareColor(rowIndex, colIndex)}
              isValidMove={validMoves.some(m => m.row === rowIndex && m.col === colIndex)}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            />
          ))}
          
          {/* Row labels */}
          <div className="row-label">{8 - rowIndex}</div>
        </div>
      ))}
      
      {/* Column labels */}
      <div className="board-labels bottom-labels">
        <div></div>
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
          <div key={letter} className="label">{letter}</div>
        ))}
        <div></div>
      </div>
    </div>
  )
}

import { useState, useCallback, type ReactNode } from 'react'
import Board from './components/Board'
import { INITIAL_BOARD, parsePiece } from './chess/pieces'
import { getValidMoves, isCheckmate, isStalemate, isKingInCheck } from './chess/logic'
import type { Board as BoardType, Color, GameStatus, Position, MoveRecord } from './types'
import './App.css'

function App(): ReactNode {
  const [board, setBoard] = useState<BoardType>(INITIAL_BOARD)
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [currentTurn, setCurrentTurn] = useState<Color>('white')
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing')
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([])

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (gameStatus !== 'playing') return

    const piece = board[row][col]
    const hasPiece = piece !== null

    // If a piece is already selected
    if (selectedSquare) {
      // Check if clicking on a valid move
      const isValidMove = validMoves.some(m => m.row === row && m.col === col)

      if (isValidMove) {
        // Make the move
        const newBoard = board.map(r => [...r])
        const movingPiece = newBoard[selectedSquare.row][selectedSquare.col]
        newBoard[row][col] = movingPiece
        newBoard[selectedSquare.row][selectedSquare.col] = null

        // Track move history
        const notation = `${String.fromCharCode(97 + col)}${8 - row}`
        if (movingPiece) {
        setMoveHistory([...moveHistory, { 
          from: `${String.fromCharCode(97 + selectedSquare.col)}${8 - selectedSquare.row}`,
          to: notation,
          piece: movingPiece
        }])
        }

        setBoard(newBoard)
        setSelectedSquare(null)
        setValidMoves([])
        setCurrentTurn(currentTurn === 'white' ? 'black' : 'white')

        // Check game status
        const nextColor: Color = currentTurn === 'white' ? 'black' : 'white'
        if (isCheckmate(newBoard, nextColor)) {
          setGameStatus(`checkmate-${currentTurn}`)
        } else if (isStalemate(newBoard, nextColor)) {
          setGameStatus('stalemate')
        } else if (isKingInCheck(newBoard, nextColor)) {
          setGameStatus('check')
        }
        return
      }

      // If clicking on own piece, select it instead
      if (hasPiece && parsePiece(piece)?.color === currentTurn) {
        setSelectedSquare({ row, col })
        const moves = getValidMoves(board, row, col)
        setValidMoves(moves)
        return
      }

      // Deselect
      setSelectedSquare(null)
      setValidMoves([])
      return
    }

    // Select a piece
    if (hasPiece && parsePiece(piece)?.color === currentTurn) {
      setSelectedSquare({ row, col })
      const moves = getValidMoves(board, row, col)
      setValidMoves(moves)
    }
  }, [board, selectedSquare, validMoves, currentTurn, gameStatus, moveHistory])

  const resetGame = () => {
    setBoard(INITIAL_BOARD)
    setSelectedSquare(null)
    setValidMoves([])
    setCurrentTurn('white')
    setGameStatus('playing')
    setMoveHistory([])
  }

  const getStatusMessage = (): string => {
    switch (gameStatus) {
      case 'checkmate-white':
        return 'Checkmate! White wins!'
      case 'checkmate-black':
        return 'Checkmate! Black wins!'
      case 'stalemate':
        return 'Stalemate! Draw.'
      case 'check':
        return `${currentTurn === 'white' ? 'Black' : 'White'} is in check!`
      default:
        return `${currentTurn === 'white' ? 'White' : 'Black'}'s turn`
    }
  }

  return (
    <div className="app">
      <h1 className="title">Chess Game</h1>
      <div className="game-container">
        <div className="status-bar">
          <span className={`status ${gameStatus === 'check' ? 'check' : ''}`}>
            {getStatusMessage()}
          </span>
          <button className="reset-button" onClick={resetGame}>
            New Game
          </button>
        </div>
        <Board 
          board={board} 
          onSquareClick={handleSquareClick}
          selectedSquare={selectedSquare}
          validMoves={validMoves}
        />
        {moveHistory.length > 0 && (
          <div className="move-history">
            <h3>Move History</h3>
            <div className="moves-list">
              {moveHistory.map((move, index) => (
                <span key={index} className="move-item">
                  {Math.floor(index / 2) + 1}. {move.from}→{move.to} 
                  <span className={`piece-icon ${move.piece[0] === 'w' ? 'white' : 'black'}`}>
                    {move.piece[1] === 'p' ? '♙' : move.piece[1] === 'r' ? '♖' : move.piece[1] === 'n' ? '♘' : move.piece[1] === 'b' ? '♗' : move.piece[1] === 'q' ? '♕' : '♔'}
                  </span>
                  {'  '}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

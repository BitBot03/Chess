import { Chess, Move } from 'chess.js';

const pieceValues: { [key: string]: number } = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000,
};

// Positional values (simplified piece-square tables)
// These values are for white. For black, invert the rank.
const pawnPos = [
  [0,  0,  0,  0,  0,  0,  0,  0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5,  5, 10, 25, 25, 10,  5,  5],
  [0,  0,  0, 20, 20,  0,  0,  0],
  [5, -5,-10,  0,  0,-10, -5,  5],
  [5, 10, 10,-20,-20, 10, 10,  5],
  [0,  0,  0,  0,  0,  0,  0,  0]
];
// ... (add more for other pieces for better AI, but this is a start)

const evaluateBoard = (game: Chess) => {
  if (game.isCheckmate()) {
    return game.turn() === 'b' ? Infinity : -Infinity;
  }
  if (game.isDraw()) {
    return 0;
  }

  let totalEvaluation = 0;
  game.board().forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      if (piece) {
        const materialValue = pieceValues[piece.type];
        let positionalValue = 0;
        if (piece.type === 'p') {
            positionalValue = piece.color === 'w' ? pawnPos[rowIndex][colIndex] : pawnPos[7-rowIndex][colIndex];
        }
        
        const value = materialValue + positionalValue;
        totalEvaluation += value * (piece.color === 'w' ? 1 : -1);
      }
    });
  });
  return totalEvaluation;
};

const SEARCH_DEPTH = 2; // Keep it low for performance in browser

const minimax = (game: Chess, depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean): number => {
    if (depth === 0 || game.isGameOver()) {
        return evaluateBoard(game);
    }

    const newGameMoves = game.moves({ verbose: true });
    newGameMoves.sort(() => Math.random() - 0.5); // Add randomness

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of newGameMoves) {
            game.move(move);
            const currentEval = minimax(game, depth - 1, alpha, beta, false);
            game.undo();
            maxEval = Math.max(maxEval, currentEval);
            alpha = Math.max(alpha, currentEval);
            if (beta <= alpha) {
                break;
            }
        }
        return maxEval;
    } else { // Minimizing player
        let minEval = Infinity;
        for (const move of newGameMoves) {
            game.move(move);
            const currentEval = minimax(game, depth - 1, alpha, beta, true);
            game.undo();
            minEval = Math.min(minEval, currentEval);
            beta = Math.min(beta, currentEval);
            if (beta <= alpha) {
                break;
            }
        }
        return minEval;
    }
};

export const findBestMove = (game: Chess): Promise<Move | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newGameMoves = game.moves({ verbose: true });
            if (newGameMoves.length === 0) {
              resolve(null);
              return;
            }

            let bestMoveFound: Move = newGameMoves[0];
            const isMaximizing = game.turn() === 'w';
            let bestValue = isMaximizing ? -Infinity : Infinity;

            for (const move of newGameMoves) {
                const gameCopy = new Chess(game.fen());
                gameCopy.move(move);
                const boardValue = minimax(gameCopy, SEARCH_DEPTH - 1, -Infinity, Infinity, !isMaximizing);
                
                if (isMaximizing) {
                    if (boardValue > bestValue) {
                        bestValue = boardValue;
                        bestMoveFound = move;
                    }
                } else {
                    if (boardValue < bestValue) {
                        bestValue = boardValue;
                        bestMoveFound = move;
                    }
                }
            }
            resolve(bestMoveFound);
        }, 50); // Small timeout to unblock UI thread
    });
};

export const getEvaluation = (game: Chess): number => {
    const rawEval = evaluateBoard(game);
    // Convert to a pawn advantage value and clamp it for the UI.
    const pawnAdvantage = rawEval / 100;
    return Math.max(-10, Math.min(10, pawnAdvantage));
}

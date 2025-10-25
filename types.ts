
import { Square as ChessJsSquare, Piece as ChessJsPiece, Move, Chess } from 'chess.js';

export type Square = ChessJsSquare;
export type Piece = ChessJsPiece;

export type ControlAction = 'settings' | 'hint' | 'undo';

export type GameOverData = {
    winner: 'w' | 'b' | 'draw';
    reason: 'checkmate' | 'stalemate' | 'draw' | 'timeout';
} | null;

export interface LayoutProps {
    game: Chess;
    fen: string;
    history: Move[];
    makeMove: (from: Square, to: Square) => void;
    navigateToMove: (index: number) => void;
    currentMoveIndex: number;
    lastMove: { from: Square; to: Square } | null;
    getLegalMoves: (square: Square) => Move[];
    capturedPieces: {
        w: Piece[];
        b: Piece[];
    };
    materialAdvantage: number;
    gameOverData: GameOverData;
    evaluation: number;
    isComputerThinking: boolean;
    hintMove: { from: Square; to: Square } | null;
    gameMode: 'pvc' | 'pvp';
    playerNames: {
        player1: string;
        player2: string;
    };
    player1Time: number | null;
    player2Time: number | null;
    handleRequestExit: () => void;
    showEvaluationBar: boolean;
    showMoveFeedback: boolean;
    analysisMode: boolean;
    analysisBestMove: string | null;
    enableHints: boolean;
    enablePieceRotation: boolean;
    handleControlClick: (action: ControlAction) => void;
}

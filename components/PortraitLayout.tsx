
import React from 'react';
import { Board } from './Board';
import { Header } from './Header';
import { OpponentInfo } from './OpponentInfo';
import { EvaluationBar } from './EvaluationBar';
import { MoveHistory } from './MoveHistory';
import { Controls } from './Controls';
import { AnalysisDisplay } from './AnalysisDisplay';
import { PlayerInfo } from './PlayerInfo';
import { LayoutProps } from '../types';

export const PortraitLayout: React.FC<LayoutProps> = (props) => {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-col flex-grow min-h-0">
                <div className="shrink-0">
                    <Header onBack={props.handleRequestExit}/>
                    <div className="px-2 pb-1">
                        <div className="mt-2">
                          {props.showEvaluationBar ? <EvaluationBar evaluation={props.evaluation} isLoading={props.isComputerThinking} /> : <div className="h-3" />}
                        </div>
                        {props.showMoveFeedback ? (
                            <AnalysisDisplay 
                                move={props.history[props.currentMoveIndex - 1]}
                                moveIndex={props.currentMoveIndex}
                                analysisMode={props.analysisMode}
                                bestMoveSan={props.analysisBestMove}
                            />
                        ) : (
                            <div className="h-10" />
                        )}
                    </div>
                </div>

                <main className="flex-grow flex flex-col items-center justify-center min-h-0 overflow-y-auto p-2">
                    <div className="w-full max-w-[calc(100vh-220px)] mx-auto flex flex-col">
                        <OpponentInfo 
                            capturedPieces={props.capturedPieces.w} 
                            materialAdvantage={props.materialAdvantage}
                            playerName={props.playerNames.player2}
                            isComputer={props.gameMode === 'pvc'}
                            timeInSeconds={props.player2Time}
                            isTurn={props.game.turn() === 'b'}
                        />
                        <Board
                            fen={props.fen}
                            onMove={props.makeMove}
                            turn={props.game.turn()}
                            lastMove={props.lastMove}
                            getLegalMoves={props.getLegalMoves}
                            enablePieceRotation={props.enablePieceRotation}
                            hintMove={props.hintMove}
                            isInteractionDisabled={props.isComputerThinking || (!!props.gameOverData && !props.analysisMode)}
                            analysisMode={props.analysisMode}
                            currentMoveIndex={props.currentMoveIndex}
                            historyLength={props.history.length}
                            onRequestNavigation={props.navigateToMove}
                        />
                        <PlayerInfo 
                            capturedPieces={props.capturedPieces.b} 
                            materialAdvantage={props.materialAdvantage}
                            playerName={props.playerNames.player1}
                            timeInSeconds={props.player1Time}
                            isTurn={props.game.turn() === 'w'}
                        />
                    </div>
                </main>
                
                <div className="shrink-0">
                    <MoveHistory
                        history={props.history}
                        currentMoveIndex={props.currentMoveIndex}
                        onNavigate={props.navigateToMove}
                    />
                    <Controls onControlClick={props.handleControlClick} isHintEnabled={props.enableHints && !props.analysisMode} />
                </div>
            </div>
        </div>
    );
};
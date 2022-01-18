import { useState, useEffect } from "react";
import BoardContainer from "./BoardComponents/BoardContainer";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Coordinate } from "./Pieces/Coordinate";
import { Piece } from "./Pieces/Piece";
import { initializeBoard } from '../src/Utilities/GameSetupUtilities'
import { Pieces } from "./Enums/PieceEnum";
import { isValidMove, createCopyOfCurrentBoardAfterMove } from "./Utilities/ValidationUtilities";

const Chess = (): JSX.Element => {
    const [board, setBoard] = useState(initializeBoard());
    const [isWhitesTurn, setIsWhitesTurn] = useState(true);
    const [isCheck, setIsCheck] = useState(false);

    function handleIsValidMove(moveLocation: Coordinate, piece: Piece){
        if (!isValidMove(moveLocation, piece, board)) return false;

        const boardWithMoveExecuted = createCopyOfCurrentBoardAfterMove(moveLocation, piece, board);
        
        if(checkIfIsCheck(piece.color, boardWithMoveExecuted)) return false;

        return true;
    }

    const handlePieceMove = (moveLocation: Coordinate, piece: Piece): void => {
        updatePieceLocation(moveLocation, piece);
        setIsWhitesTurn(prevState => !prevState);
        if(checkIfIsCheck(getOppositeColor(piece.color), board)) setIsCheck(true);
    }

    function checkIfIsCheck(color: string, boardToCheck: Array<Array<(Piece | null)>>) {
        const locationOfWhiteKing = getLocationOfKingByTeam(color, boardToCheck);

        return locationOfKingIsValidMoveForOpposingTeam(color, boardToCheck, locationOfWhiteKing);
    }

    function locationOfKingIsValidMoveForOpposingTeam(color: string, boardToCheck: (Piece | null)[][], locationOfWhiteKing: Coordinate | undefined) {
        return getPiecesFromBoardByTeam(getOppositeColor(color), boardToCheck)
            .some(piece => isValidMove(locationOfWhiteKing as Coordinate, piece as Piece, boardToCheck));
    }

    function getOppositeColor(color: string): string {
        return color === 'white' ? 'black' : 'white';
    }

    function getPiecesFromBoardByTeam(teamColor: string, boardToCheck: (Piece | null)[][]) {
        return boardToCheck.flat().filter(piece => piece?.color === teamColor);
    }

    function getLocationOfKingByTeam(teamColor: string, boardToCheck: Array<Array<(Piece | null)>>) {
        return boardToCheck.flat().find(piece => piece?.color === teamColor && piece.pieceName === Pieces.KING)?.currentLocation;
    }

    function updatePieceLocation(moveLocation: Coordinate, piece: Piece) {
        board[moveLocation.x][moveLocation.y] = piece;
        board[piece.currentLocation.x][piece.currentLocation.y] = null;
        setBoard([...board]);

        piece.setCurrentLocation(moveLocation);
    }

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <BoardContainer board={board} handlePieceMove={handlePieceMove} isValidMove={handleIsValidMove} isWhitesTurn={isWhitesTurn}/>
            </DndProvider>
            <p>{isCheck ? 'A team is in check!' : 'Nobody is in check'}</p>
        </>
    )
}

export default Chess
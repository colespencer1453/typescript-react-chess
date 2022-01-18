import { useState, useEffect } from "react";
import BoardContainer from "./BoardComponents/BoardContainer";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Coordinate } from "./Pieces/Coordinate";
import { Piece } from "./Pieces/Piece";
import { createTeamPieces, initializeBoard } from '../src/Utilities/GameSetupUtilities'
import { Pieces } from "./Enums/PieceEnum";
import { isValidMove } from "./Utilities/ValidationUtilities";

const Chess = (): JSX.Element => {
    const [whitePieces, setWhitePieces] = useState(createTeamPieces('white'));
    const [blackPieces, setBlackPieces] = useState(createTeamPieces('black'));
    const [board, setBoard] = useState(initializeBoard(whitePieces, blackPieces));
    const [isWhitesTurn, setIsWhitesTurn] = useState(true);
    const [isCheck, setIsCheck] = useState(false);
    const [whiteKingLocation, setWhiteKingLocation] = useState(new Coordinate(7,4));
    const [blackKingLocation, setBlackKingLocation] = useState(new Coordinate(0, 4));

    function handleIsValidMove(moveLocation: Coordinate, piece: Piece){
        return isValidMove(moveLocation, piece, board);
    }

    const handlePieceMove = (moveLocation: Coordinate, piece: Piece): void => {
        removePieceIfPieceAttacked(moveLocation, piece);
        updatePieceLocation(moveLocation, piece);
        setIsWhitesTurn(prevState => !prevState);
        updateKingLocationIfMoved(moveLocation, piece);
        updateIsCheck(piece);
    }

    function removePieceIfPieceAttacked(moveLocation: Coordinate, piece: Piece) {
        const occupyingPiece = getPieceAtLocation(moveLocation);
     
        if (occupyingPiece !== null)
           removePieceFromActivePieces(piece, occupyingPiece);
    }

    function updateKingLocationIfMoved(moveLocation: Coordinate, piece: Piece) {
        if(piece.pieceName !== Pieces.KING) return;

        if (piece.color === 'white') {
            setWhiteKingLocation(moveLocation);
        } else {
            setBlackKingLocation(moveLocation);
        }
    }

    function updateIsCheck(piece: Piece) {
        if (piece.color === 'white') {
           if (whitePieces.some(piece => handleIsValidMove(blackKingLocation, piece))) {
              setIsCheck(true);
           }
        } else {
           if (blackPieces.some(piece => handleIsValidMove(whiteKingLocation, piece))) {
              setIsCheck(true);
           }
        }
    }
     
    function getPieceAtLocation(location: Coordinate): (Piece | null){
        return board[location.x][location.y];
    }

    function removePieceFromActivePieces(piece: Piece, occupyingPiece: Piece) {
        if (piece.color === 'white') {
            setBlackPieces(blackPieces.filter(piece => piece.uuid === occupyingPiece.uuid));
        } else {
            setWhitePieces(whitePieces.filter(piece => piece.uuid === occupyingPiece.uuid));
        }
    }

    function updatePieceLocation(moveLocation: Coordinate, piece: Piece) {
        board[moveLocation.x][moveLocation.y] = piece;
        board[piece.currentLocation.x][piece.currentLocation.y] = null;
        setBoard([...board]);

        piece.setCurrentLocation(moveLocation);
    }

    useEffect(() => {
        setWhitePieces([...whitePieces]);
        setBlackPieces([...blackPieces]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [board]);

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
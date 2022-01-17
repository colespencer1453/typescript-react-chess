import { useState, useEffect } from "react";
import BoardContainer from "./BoardComponents/BoardContainer";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Coordinate } from "./Pieces/Coordinate";
import { Piece } from "./Pieces/Piece";
import { createTeamPieces, initializeBoard } from '../src/Utilities/GameSetupUtilities'
import { Pieces } from "./Enums/PieceEnum";
import { calculateAbsoluteSlope, getSubsetOfPointsBetweenTwoPoints, getSubsetOfPointsBetweenTwoPointsOnAVerticalLine } from "./Utilities/ValidationUtilities";


const Chess = (): JSX.Element => {
    const [whitePieces, setWhitePieces] = useState(createTeamPieces('white'));
    const [blackPieces, setBlackPieces] = useState(createTeamPieces('black'));
    const [board, setBoard] = useState(initializeBoard(whitePieces, blackPieces));
    const [isWhitesTurn, setIsWhitesTurn] = useState(true);
    const [isCheck, setIsCheck] = useState(false);
    const [whiteKingLocation, setWhiteKingLocation] = useState(new Coordinate(7,4));
    const [blackKingLocation, setBlackKingLocation] = useState(new Coordinate(0, 4));

    function isValidMove(moveLocation: Coordinate, piece: Piece){
        if(!piece.isValidMove(moveLocation)) return false;

        const contentsOfMoveSquare = getPieceAtLocation(moveLocation);

        if(pieceAtMoveLocationIsSameTeam(contentsOfMoveSquare, piece)) return false;
        if(shouldDisablePawnAttackMove(moveLocation, piece, contentsOfMoveSquare)) return false;
        if(pieceIsBlockingMove(moveLocation, piece)) return false;

        // case 4 if moving team is in check the move must remove them from check

        return true;
    }
  
    function pieceAtMoveLocationIsSameTeam(contentsOfMoveSquare: Piece | null, piece: Piece): boolean {
        return contentsOfMoveSquare !== null && piece.isSameTeam(contentsOfMoveSquare as Piece);
    }

    function shouldDisablePawnAttackMove(moveLocation: Coordinate, piece: Piece, contentsOfMoveSquare: Piece | null): boolean {
        if(piece.pieceName !== Pieces.PAWN) return false;

        return pawnCanAttack(moveLocation, piece, contentsOfMoveSquare);
    }

    function pawnCanAttack(moveLocation: Coordinate, piece: Piece, contentsOfMoveSquare: Piece | null): boolean {
        return (calculateAbsoluteSlope(moveLocation, piece.currentLocation) === 1 && contentsOfMoveSquare === null);
    }

    function pieceIsBlockingMove(moveLocation: Coordinate, piece: Piece): boolean {
        if(piece.pieceName === Pieces.KNIGHT) return false;

        return pieceExistsBetweenTwoPoints(piece.currentLocation, moveLocation);
    }

    function pieceExistsBetweenTwoPoints(currentLocation: Coordinate, moveLocation: Coordinate) : boolean {
        const slope = calculateAbsoluteSlope(currentLocation, moveLocation);
  
        if(slope === Infinity) {
           return getSubsetOfPointsBetweenTwoPointsOnAVerticalLine(currentLocation, moveLocation)
              .map(point => getPieceAtLocation(point))
                 .some(piece => piece !== null);
        }
  
        return getSubsetOfPointsBetweenTwoPoints(currentLocation, moveLocation)
           .map(point => getPieceAtLocation(point))
           .some(piece => piece !== null);
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
           if (whitePieces.some(piece => isValidMove(blackKingLocation, piece))) {
              setIsCheck(true);
           }
        } else {
           if (blackPieces.some(piece => isValidMove(whiteKingLocation, piece))) {
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
                <BoardContainer board={board} handlePieceMove={handlePieceMove} isValidMove={isValidMove} isWhitesTurn={isWhitesTurn}/>
            </DndProvider>
            <p>{isCheck ? 'A team is in check!' : 'Nobody is in check'}</p>
        </>
    )
}

export default Chess
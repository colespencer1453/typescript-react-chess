import React, {useState} from "react";
import Board from "./BoardComponents/Board";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Pawn } from "./Pieces/Pawn";
import { Coordinate } from "./Pieces/Coordinate";
import { Rook } from "./Pieces/Rook";
import { Knight } from "./Pieces/Knight";
import { Bishop } from "./Pieces/Bishop";
import { Queen } from "./Pieces/Queen";
import { King } from "./Pieces/King";
import { Piece } from "./Pieces/Piece";

const createPawn = (columnIndex: number, color: string) : Pawn => {
    let rowIndex = color === 'white' ? 6 : 1;
    return new Pawn(new Coordinate(rowIndex, columnIndex), color);
}

const createPawnRow = (color: string) : Array<object> => {
    let row = [];

    for(let i = 0; i<8; i++){
        row.push(createPawn(i, color));
    }

    return row;
}

const createRoyalRow = (color: string) : Array<Piece> => {
    let row = [];
    let rowIndex = color === 'white' ? 7 : 0;

    row.push(new Rook(new Coordinate(rowIndex, 0), color));
    row.push(new Knight(new Coordinate(rowIndex, 1), color));
    row.push(new Bishop(new Coordinate(rowIndex, 2), color));
    row.push(new Queen(new Coordinate(rowIndex, 3), color));
    row.push(new King(new Coordinate(rowIndex, 4), color));
    row.push(new Bishop(new Coordinate(rowIndex, 5), color));
    row.push(new Knight(new Coordinate(rowIndex, 6), color));
    row.push(new Rook(new Coordinate(rowIndex, 7), color));

    return row;
}

const getNullRow = () => {
    return [null, null, null, null, null, null, null, null];
}

const initializeBoard = () : Array<Array<any>> => {
    return [
        createRoyalRow('black'),
        createPawnRow('black'),
        getNullRow(),
        getNullRow(),
        getNullRow(),
        getNullRow(),
        createPawnRow('white'),
        createRoyalRow('white'),
    ];
}

const Chess = (): JSX.Element => {
    const [board, setBoard] = useState(initializeBoard());

    const handleMovePiece = (x: number, y: number, piece : Piece) : void => {
        board[x][y] = piece;
        board[piece.coordinate.x][piece.coordinate.y] = null
        piece.setCoordinate(x, y);
        setBoard(prevState => [...prevState])
    }

    const isValidMove = () => {

    }

    return (
        <DndProvider backend={HTML5Backend}>
            <Board board={board} handleMovePiece={handleMovePiece}/>
        </DndProvider>
    )
}

export default Chess
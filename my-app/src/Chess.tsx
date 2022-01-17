import React, {useState} from "react";
import BoardContainer from "./BoardComponents/BoardContainer";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Board } from "./Pieces/Board";
import { Coordinate } from "./Pieces/Coordinate";
import { Piece } from "./Pieces/Piece";

const Chess = (): JSX.Element => {
    const [board, setBoard] = useState(new Board());

    const handlePieceMove = (moveLocation: Coordinate, piece: Piece): void => {
        board.movePiece(moveLocation, piece);
        setBoard(Object.create(board));
    }

    const isValidMove = (moveLocation: Coordinate, piece: Piece) : boolean => {
        return board.isValidMove(moveLocation, piece);
    }

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <BoardContainer board={board.pieces} handlePieceMove={handlePieceMove} isValidMove={isValidMove} colorOfActiveTurn={board.colorOfActiveTurn}/>
            </DndProvider>
            <p>{board.isCheck ? 'A team is in check!' : 'Nobody is in check'}</p>
        </>
    )
}

export default Chess
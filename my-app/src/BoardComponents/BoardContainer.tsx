import Row from "./Row";
import { Piece } from "../Pieces/Piece";
import { Board } from "../Pieces/Board";

interface BoardProps {
    board: Array<Array<(Piece | null)>>;
    isValidMove: Function;
    handlePieceMove: Function;
}

const BoardContainer = ({ board, isValidMove, handlePieceMove } : BoardProps) => {
    return (
        <>
            {
                board.map((row, index) => 
                    <Row 
                        row={row} 
                        key={index} 
                        rowIndex={index} 
                        isValidMove={isValidMove}
                        handlePieceMove={handlePieceMove}
                    />
                )
            }
        </>
    )
};

export default BoardContainer;
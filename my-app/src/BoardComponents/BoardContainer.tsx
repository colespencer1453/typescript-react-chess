import Row from "./Row";
import { Piece } from "../Pieces/Piece";

interface BoardProps {
    board: Array<Array<(Piece | null)>>;
    isValidMove: Function;
    handlePieceMove: Function;
    isWhitesTurn: boolean;
}

const BoardContainer = ({ board, isValidMove, handlePieceMove, isWhitesTurn } : BoardProps) => {
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
                        isWhitesTurn={isWhitesTurn}
                    />
                )
            }
        </>
    )
};

export default BoardContainer;
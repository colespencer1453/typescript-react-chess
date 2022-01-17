import Row from "./Row";
import { Piece } from "../Pieces/Piece";

interface BoardProps {
    board: Array<Array<(Piece | null)>>;
    isValidMove: Function;
    handlePieceMove: Function;
    colorOfActiveTurn: string;
}

const BoardContainer = ({ board, isValidMove, handlePieceMove, colorOfActiveTurn } : BoardProps) => {
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
                        colorOfActiveTurn={colorOfActiveTurn}
                    />
                )
            }
        </>
    )
};

export default BoardContainer;
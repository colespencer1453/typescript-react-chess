import Row from "./Row";

interface BoardProps {
    board: Array<Array<any>>;
    handleMovePiece: Function;
}

const Board = ({board, handleMovePiece} : BoardProps) => {
    return (
        <>
            {
                board.map((row, index) => 
                    <Row row={row} key={index} rowIndex={index} handleMovePiece={handleMovePiece}/>
                )
            }
        </>
    )
};

export default Board;
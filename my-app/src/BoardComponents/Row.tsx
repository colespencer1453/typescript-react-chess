import Cell from "./Cell";
import { Grid } from "@mui/material";
import PieceContainer from "../BoardComponents/PieceContainer"
import { Piece } from "../Pieces/Piece";
import { Board } from "../Pieces/Board";


interface RowProps {
    row: (Piece | null)[];
    rowIndex: number;
    isValidMove: Function;
    handlePieceMove: Function;
}

const Row = ({ row, rowIndex, handlePieceMove, isValidMove } : RowProps) => {
    return (
        <Grid container>
            {
                row.map((piece, index) => {
                    return (
                        <Cell 
                            x={rowIndex}
                            y={index} 
                            key={`${index}-${piece?.uuid}`}
                            isValidMove={isValidMove}
                            handlePieceMove={handlePieceMove}
                        >
                            {piece ? <PieceContainer key={piece?.uuid} piece={piece}/> : <></>}
                        </Cell>
                    )
                })
            }
        </Grid>
    )
};

export default Row;
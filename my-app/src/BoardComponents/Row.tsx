import Cell from "./Cell";
import { Grid } from "@mui/material";
import PieceContainer from "../BoardComponents/PieceContainer"

interface RowProps {
    row: Array<any>;
    rowIndex: number;
    handleMovePiece: Function;
}

const Row = ({row, rowIndex, handleMovePiece} : RowProps) => {
    return (
        <Grid container>
            {
                row.map((piece, index) => {
                    return (
                        <Cell 
                            x={rowIndex}
                            y={index} 
                            key={index} 
                            handleMovePiece={handleMovePiece}
                        >
                            {piece ? <PieceContainer piece={piece}/> : <></>}
                        </Cell>
                    )
                })
            }
        </Grid>
    )
};

export default Row;
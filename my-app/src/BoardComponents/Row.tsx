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
                            key={`${index}-${piece?.uuid}`} 
                            handleMovePiece={handleMovePiece}
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
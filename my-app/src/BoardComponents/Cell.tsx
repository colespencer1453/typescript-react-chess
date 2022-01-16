import { useDrop } from 'react-dnd'
import { Coordinate } from '../Pieces/Coordinate';
import { Piece } from '../Pieces/Piece';

interface CellProps {
    x: number;
    y: number;
    handleMovePiece: Function;
    children?: JSX.Element;
}

const greenSquare = {
    backgroundColor: '#779556',
    height:'85px',
    width:'85px',
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
};

const offWhiteSquare = {
    backgroundColor: '#f8f8ff',
    height:'85px',
    width:'85px',
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
}

const Cell = ({x, y, children, handleMovePiece} : CellProps) => {
    const [{ isOver, canDrop }, drop] = useDrop(
        () => ({
          accept: 'piece',
          drop: (piece) => handleMovePiece(x,y, piece),
          canDrop: (piece:Piece) => piece.isValidMove(new Coordinate(x, y)),
          collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
          })
        }),
        [x, y]
    );

    const getSquareStyle = () => {
        return (x+y) % 2 === 1 ? greenSquare : offWhiteSquare
    }
    
    return (    
        <div ref={drop} style={getSquareStyle()} >
            {children}
        </div>
    )
}

export default Cell;
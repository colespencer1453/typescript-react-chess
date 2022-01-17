import { useDrag } from 'react-dnd'
import { Piece } from "../Pieces/Piece";

interface PieceContainerProps {
   piece: (Piece | null);
}

const PieceContainer = ({piece} : PieceContainerProps) => {
   const [{ isDragging }, drag] = useDrag(() => ({
      type: 'piece',
      item: piece,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      })
    }))

   const Icon = piece?.icon;

   const style = { 
      opacity: isDragging ? .4 : 1,
      cursor: 'grab',
   }

   return (
      <div 
         ref={drag}
         style={style}
      >
         {piece ? <Icon size={48} style={{color:piece.color === 'white' ? "#efdfbb" : piece.color}}/> : <></>}
      </div>
   );
}

export default PieceContainer
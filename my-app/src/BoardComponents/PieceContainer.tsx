import { useDrag } from 'react-dnd'

interface PieceContainerProps {
   piece: any;
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

   return (
      <div 
         ref={drag}
         style={{
            opacity: isDragging ? .4 : 1,
          }}
      >
         {piece ? <Icon size={48} style={{color:piece.color === 'white' ? "#efdfbb" : piece.color}}/> : <></>}
      </div>
   );
}

export default PieceContainer
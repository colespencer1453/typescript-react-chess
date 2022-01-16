import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import  { ChessKing } from '@emotion-icons/fa-solid'

export class King extends Piece{ 

   constructor(coordinate: Coordinate, color: string) {
      super(ChessKing, coordinate, color);
   }
   
   isValidMove( moveLocation: Coordinate): boolean {
      return [this.coordinate.x + 1, this.coordinate.x - 1, this.coordinate.x].includes(moveLocation.x)
      && [this.coordinate.y + 1, this.coordinate.y - 1, this.coordinate.y].includes(moveLocation.y)
      && !moveLocation.equals(this.coordinate);
   }
}

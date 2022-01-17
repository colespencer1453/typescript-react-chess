import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import  { ChessKing } from '@emotion-icons/fa-solid'
import { Pieces } from "../Enums/PieceEnum";

export class King extends Piece{ 

   constructor(coordinate: Coordinate, color: string) {
      super(ChessKing, coordinate, color, Pieces.KING);
   }
   
   isValidMove( moveLocation: Coordinate): boolean {
      return [this.currentLocation.x + 1, this.currentLocation.x - 1, this.currentLocation.x].includes(moveLocation.x)
      && [this.currentLocation.y + 1, this.currentLocation.y - 1, this.currentLocation.y].includes(moveLocation.y)
      && !moveLocation.equals(this.currentLocation);
   }
}

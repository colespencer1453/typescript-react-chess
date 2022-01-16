import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import  { ChessPawn } from '@emotion-icons/fa-solid'

export class Pawn extends Piece{ 
   constructor(coordinate: Coordinate, color: string) {
      super(ChessPawn, coordinate, color);
   }

   isValidMove(moveLocation: Coordinate): boolean {
      if(this.color === 'white'){
         return (moveLocation.x === (this.coordinate.x - 1)) && (moveLocation.y === this.coordinate.y);
      } else {
         return (moveLocation.x === (this.coordinate.x + 1)) && (moveLocation.y === this.coordinate.y);
      }
   }
}

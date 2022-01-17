import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import  { ChessPawn } from '@emotion-icons/fa-solid'
import { Pieces } from "../Enums/PieceEnum";

export class Pawn extends Piece{ 
   constructor(startLocation: Coordinate, color: string) {
      super(ChessPawn, startLocation, color, Pieces.PAWN);
   }

   isValidMove(moveLocation: Coordinate): boolean {
      if(this.color === 'white'){
         return (moveLocation.x === (this.currentLocation.x - 1)) && (moveLocation.y === this.currentLocation.y);
      } else {
         return (moveLocation.x === (this.currentLocation.x + 1)) && (moveLocation.y === this.currentLocation.y);
      }
   }
}

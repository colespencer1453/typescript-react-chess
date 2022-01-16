import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import  { ChessBishop } from '@emotion-icons/fa-solid'
import { calculateSlope } from "../Utilities/ValidationUtilities";

export class Bishop extends Piece{ 

   constructor(coordinate: Coordinate, color: string) {
      super(ChessBishop, coordinate, color);
   }
   
   isValidMove( moveLocation: Coordinate): boolean {
      return Math.abs(calculateSlope(moveLocation, this.coordinate)) === 1;
   }
}

import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import  { ChessQueen } from '@emotion-icons/fa-solid'
import { calculateAbsoluteSlope } from "../Utilities/ValidationUtilities";

export class Queen extends Piece { 
   constructor(coordinate: Coordinate, color: string) {
      super(ChessQueen, coordinate, color);
   }
   
   isValidMove(moveLocation: Coordinate): boolean {
      return [1, Infinity, 0].includes(calculateAbsoluteSlope(moveLocation, this.coordinate));
   }
}

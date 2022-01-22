import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import  { ChessRook } from '@emotion-icons/fa-solid'
import { calculateAbsoluteSlope } from "../Utilities/ValidationUtilities";
import { Pieces } from "../Enums/Pieces";
import { Teams } from "../Enums/Teams";

export class Rook extends Piece{ 

   constructor(coordinate: Coordinate, team: Teams) {
      super(ChessRook, coordinate, team, Pieces.ROOK);
   }
   
   isValidMove( moveLocation: Coordinate): boolean {
      return [Infinity, 0].includes(calculateAbsoluteSlope(moveLocation, this.currentLocation));
   }
}
